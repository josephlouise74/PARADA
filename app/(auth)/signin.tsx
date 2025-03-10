import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
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
            // Call your onSignIn callback if needed
            onSignIn(data.email, data.password);
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
        <ScrollView className="flex-grow bg-gray-50 p-5">
            <View className="flex-1">
                <View className="items-center my-8">
                    {/* Uncomment and update the source with your logo */}
                    {/* <Image
              source={require("@/assets/logo.png")}
              className="w-36 h-36"
              resizeMode="contain"
            /> */}
                </View>

                <Text className="text-center text-2xl font-bold text-blue-900 mb-2">
                    Welcome Back!
                </Text>
                <Text className="text-center text-base text-gray-600 mb-8">
                    Your reliable ride is just a tap away
                </Text>

                {/* Email Input */}
                <View className="flex-row items-center bg-white rounded-lg px-4 border border-gray-300 h-14 mb-4 shadow">
                    <Ionicons name="mail-outline" size={20} color="#4A90E2" className="mr-2.5" />
                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <TextInput
                                className="flex-1 text-base text-gray-800"
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
                {errors.email && (
                    <Text className="ml-1 text-sm text-red-500 mb-4">{errors.email.message}</Text>
                )}

                {/* Password Input */}
                <View className="flex-row items-center bg-white rounded-lg px-4 border border-gray-300 h-14 mb-4 shadow">
                    <Ionicons name="lock-closed-outline" size={20} color="#4A90E2" className="mr-2.5" />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <TextInput
                                className="flex-1 text-base text-gray-800"
                                placeholder="Password"
                                placeholderTextColor="#666"
                                value={field.value}
                                onChangeText={field.onChange}
                                secureTextEntry={!passwordVisible}
                            />
                        )}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} className="p-1">
                        <Ionicons
                            name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#4A90E2"
                        />
                    </TouchableOpacity>
                </View>
                {errors.password && (
                    <Text className="ml-1 text-sm text-red-500 mb-4">{errors.password.message}</Text>
                )}

                {/* Forgot Password Link */}
                <TouchableOpacity onPress={() => setIsForgotPassword(true)} className="self-end mb-5">
                    <Text className="text-blue-500 text-sm font-medium">Forgot Password?</Text>
                </TouchableOpacity>

                {/* Sign In Button */}
                <TouchableOpacity
                    className="bg-blue-500 py-4 rounded-lg items-center mt-3 shadow"
                    onPress={handleSubmit(handleSignIn)}
                    disabled={isSubmitting}
                >
                    <Text className="text-lg text-white font-bold">
                        {isSubmitting ? "Getting you aboard..." : "Start Your Ride"}
                    </Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <TouchableOpacity className="mt-5 items-center" onPress={() => setIsSignUp(true)}>
                    <Text className="text-base text-gray-600">
                        New to PICK n' DROP? <Text className="text-blue-500 font-bold">Join Now</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default SignIn;
