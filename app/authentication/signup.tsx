import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Ionicons } from "@expo/vector-icons";
import { z } from "zod";


// Form Schema with Zod
const signUpSchema = z
    .object({
        fullName: z.string().min(3, "Full Name must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        phoneNumber: z
            .string()
            .min(10, "Phone number must be at least 10 digits")
            .regex(/^\d+$/, "Phone number must contain only numbers"),
        userType: z.enum(["Passenger", "Driver"]),
        vehicleType: z.string().optional(),
        plateNumber: z.string().optional(),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => {
        if (data.userType === "Driver" && (!data.vehicleType || !data.plateNumber)) {
            return false;
        }
        return true;
    }, {
        message: "Vehicle Type & Plate Number are required for Drivers",
        path: ["vehicleType"],
    });

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = ({ onSignUpSuccess }: { onSignUpSuccess: () => void }) => {

    // Dropdown Picker States
    const [openUserType, setOpenUserType] = useState(false);
    const [openVehicleType, setOpenVehicleType] = useState(false);
    const [userType, setUserType] = useState<string | null>(null);
    const [vehicleType, setVehicleType] = useState<string | null>(null);

    const userTypeOptions = [
        { label: "Passenger", value: "Passenger" },
        { label: "Driver", value: "Driver" },
    ];

    const vehicleTypeOptions = [
        { label: "Jeepney", value: "Jeepney" },
        { label: "Bus", value: "Bus" },
        { label: "UV Express", value: "UV Express" },
    ];

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
            userType: undefined,
            vehicleType: "",
            plateNumber: "",
            password: "",
            confirmPassword: "",
        },
    });

    const selectedUserType = watch("userType");

    const handleSignUp = async (data: SignUpFormValues) => {
        try {

            Alert.alert(
                "Welcome to PICK n' DROP!",
                "Account created! Please verify your email to start your journey."
            );
            onSignUpSuccess();
        } catch (error: any) {
            console.error(error);
            setError("email", { message: error.message });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    {/*  <Image
            source={require("@/assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          /> */}
                </View>

                <Text style={styles.title}>Join PICK n' DROP</Text>
                <Text style={styles.subtitle}>Your journey to better commuting starts here</Text>

                {/* Full Name Input */}
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#4A90E2" style={styles.icon} />
                    <Controller
                        control={control}
                        name="fullName"
                        render={({ field }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#666"
                                value={field.value}
                                onChangeText={field.onChange}
                                autoCapitalize="words"
                            />
                        )}
                    />
                </View>
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

                {/* Email Input */}
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#4A90E2" style={styles.icon} />
                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor="#666"
                                value={field.value}
                                onChangeText={field.onChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        )}
                    />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                {/* Phone Number Input */}
                <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color="#4A90E2" style={styles.icon} />
                    <Controller
                        control={control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                placeholderTextColor="#666"
                                value={field.value}
                                onChangeText={field.onChange}
                                keyboardType="phone-pad"
                            />
                        )}
                    />
                </View>
                {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}

                {/* User Type Dropdown */}
                <View style={styles.dropdownSection}>
                    <Text style={styles.dropdownLabel}>I want to:</Text>
                    <DropDownPicker
                        open={openUserType}
                        value={userType}
                        items={userTypeOptions}
                        setOpen={setOpenUserType}
                        setValue={(callback) => {
                            const newValue = typeof callback === "function" ? callback(userType) : callback;
                            setUserType(newValue as any);
                            setValue("userType", newValue as any);
                        }}
                        setItems={() => { }}
                        placeholder="Select your role"
                        placeholderStyle={styles.dropdownPlaceholder}
                        containerStyle={styles.dropdownContainer}
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                    />
                </View>
                {errors.userType && <Text style={styles.errorText}>{errors.userType.message}</Text>}

                {/* Conditional Driver Fields */}
                {selectedUserType === "Driver" && (
                    <>
                        <View style={styles.dropdownSection}>
                            <Text style={styles.dropdownLabel}>Vehicle Type:</Text>
                            <DropDownPicker
                                open={openVehicleType}
                                value={vehicleType}
                                items={vehicleTypeOptions}
                                setOpen={setOpenVehicleType}
                                setValue={(callback) => {
                                    const newValue = typeof callback === "function" ? callback(vehicleType) : callback;
                                    setVehicleType(newValue as any);
                                    setValue("vehicleType", newValue as any);
                                }}
                                setItems={() => { }}
                                placeholder="Select vehicle type"
                                placeholderStyle={styles.dropdownPlaceholder}
                                containerStyle={styles.dropdownContainer}
                                style={styles.dropdown}
                                textStyle={styles.dropdownText}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="car-outline" size={20} color="#4A90E2" style={styles.icon} />
                            <Controller
                                control={control}
                                name="plateNumber"
                                render={({ field }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Plate Number"
                                        placeholderTextColor="#666"
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        autoCapitalize="characters"
                                    />
                                )}
                            />
                        </View>
                    </>
                )}

                {/* Password Fields */}
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#4A90E2" style={styles.icon} />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#666"
                                value={field.value}
                                onChangeText={field.onChange}
                                secureTextEntry
                            />
                        )}
                    />
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#4A90E2" style={styles.icon} />
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor="#666"
                                value={field.value}
                                onChangeText={field.onChange}
                                secureTextEntry
                            />
                        )}
                    />
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

                {/* Sign Up Button */}
                <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={handleSubmit(handleSignUp)}
                    disabled={isSubmitting}
                >
                    <Text style={styles.signUpButtonText}>
                        {isSubmitting ? "Creating Account..." : "Start Your Journey"}
                    </Text>
                </TouchableOpacity>

                {/* Sign In Link */}
                <TouchableOpacity style={styles.signInLink}>
                    <Text style={styles.switchText}>
                        Already on board? <Text style={styles.highlightText}>Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F8F9FA",
    },
    logoContainer: {
        alignItems: "center",
        marginVertical: 30,
    },
    logo: {
        width: 150,
        height: 150,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1A237E",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        height: 55,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    dropdownSection: {
        marginBottom: 15,
    },
    dropdownLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
        marginLeft: 5,
    },
    dropdownContainer: {
        height: 55,
    },
    dropdown: {
        backgroundColor: "#FFFFFF",
        borderColor: "#E0E0E0",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    dropdownText: {
        fontSize: 16,
        color: "#333",
    },
    dropdownPlaceholder: {
        color: "#666",
    },
    signUpButton: {
        backgroundColor: "#4A90E2",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#4A90E2",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    signUpButtonText: {
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    errorText: {
        color: "#FF4444",
        fontSize: 14,
        marginTop: -10,
        marginBottom: 15,
        marginLeft: 5,
    },
    signInLink: {
        marginTop: 20,
        alignItems: "center",
    },
    switchText: {
        fontSize: 16,
        color: "#666",
    },
    highlightText: {
        color: "#4A90E2",
        fontWeight: "bold",
    },
});

export default SignUp;