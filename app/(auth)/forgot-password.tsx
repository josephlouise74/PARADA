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
import { z } from "zod";

// Validation Schema
const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = ({ onGoBack }: { onGoBack: () => void }) => {

    const [emailSent, setEmailSent] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const handleForgotPassword = async (data: ForgotPasswordFormValues) => {
        try {
            console.log("data", data);
            setEmailSent(true);
            Alert.alert(
                "Reset Link Sent!",
                "Please check your email to reset your password and get back on the road."
            );
        } catch (error: any) {
            console.error(error);
            setError("email", {
                message: "We couldn't find an account with this email."
            });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onGoBack}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back-outline" size={28} color="#4A90E2" />
                </TouchableOpacity>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    {/*  <Image
            source={require("@/assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          /> */}
                </View>

                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                        Don't worry! It happens. Please enter your email address to reset your password.
                    </Text>
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#4A90E2" style={styles.icon} />
                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email address"
                                placeholderTextColor="#666"
                                value={field.value}
                                onChangeText={field.onChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!emailSent}
                            />
                        )}
                    />
                </View>
                {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                )}

                {/* Reset Button */}
                <TouchableOpacity
                    style={[
                        styles.resetButton,
                        (isSubmitting || emailSent) && styles.resetButtonDisabled
                    ]}
                    onPress={handleSubmit(handleForgotPassword)}
                    disabled={isSubmitting || emailSent}
                    activeOpacity={0.7}
                >
                    <Text style={styles.resetButtonText}>
                        {isSubmitting
                            ? "Sending Reset Link..."
                            : emailSent
                                ? "Reset Link Sent!"
                                : "Reset Password"
                        }
                    </Text>
                </TouchableOpacity>

                {/* Back to Sign In */}
                <TouchableOpacity
                    style={styles.signInLink}
                    onPress={onGoBack}
                    activeOpacity={0.7}
                >
                    <Text style={styles.switchText}>
                        Remember your password? <Text style={styles.highlightText}>Sign In</Text>
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
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        padding: 10,
        zIndex: 1,
    },
    logoContainer: {
        alignItems: "center",
        marginTop: 100,
        marginBottom: 30,
    },
    logo: {
        width: 120,
        height: 120,
    },
    headerContainer: {
        marginBottom: 30,
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
        paddingHorizontal: 20,
        lineHeight: 22,
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
    resetButton: {
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
    resetButtonDisabled: {
        backgroundColor: "#A5D3FF",
    },
    resetButtonText: {
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

export default ForgotPassword;