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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Ionicons } from "@expo/vector-icons";

import SignUp from "./signup";
import ForgotPassword from "./forgot-password";
import { z } from "zod";

const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn = ({ onSignIn }: { onSignIn: (email: string, password: string) => void }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);


    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleSignIn = async (data: SignInFormValues) => {
        try {

            console.log("data", data);
        } catch (error: any) {
            console.error(error);
            setError("email", { message: "Invalid email or password" });
        }
    };

    const handleSignUpSuccess = () => {
        Alert.alert(
            "Welcome aboard!",
            "Your account has been created. Please verify your email to begin your journey."
        );
        setIsSignUp(false);
    };

    if (isForgotPassword) {
        return <ForgotPassword onGoBack={() => setIsForgotPassword(false)} />;
    }

    if (isSignUp) {
        return <SignUp onSignUpSuccess={handleSignUpSuccess} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    {/* <Image
            source={require("@/assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          /> */}
                </View>

                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Your reliable ride is just a tap away</Text>

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

                {/* Password Input */}
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
                                secureTextEntry={!passwordVisible}
                            />
                        )}
                    />
                    <TouchableOpacity
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#4A90E2"
                        />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                {/* Forgot Password Link */}
                <TouchableOpacity
                    onPress={() => setIsForgotPassword(true)}
                    style={styles.forgotPasswordContainer}
                >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Sign In Button */}
                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleSubmit(handleSignIn)}
                    disabled={isSubmitting}
                >
                    <Text style={styles.signInButtonText}>
                        {isSubmitting ? "Getting you aboard..." : "Start Your Ride"}
                    </Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <TouchableOpacity
                    style={styles.signUpLink}
                    onPress={() => setIsSignUp(true)}
                >
                    <Text style={styles.switchText}>
                        New to PICK n' DROP? <Text style={styles.highlightText}>Join Now</Text>
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
    eyeIcon: {
        padding: 5,
    },
    forgotPasswordContainer: {
        alignSelf: "flex-end",
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: "#4A90E2",
        fontSize: 14,
        fontWeight: "500",
    },
    signInButton: {
        backgroundColor: "#4A90E2",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#4A90E2",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    signInButtonText: {
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
    signUpLink: {
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

export default SignIn;