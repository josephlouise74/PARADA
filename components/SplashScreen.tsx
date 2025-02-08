import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Prevent auto-hiding before assets are loaded
SplashScreen.preventAutoHideAsync();

const SplashScreenComponent = () => {
    const fadeAnim = new Animated.Value(0); // Initial opacity: 0

    useEffect(() => {
        const fadeIn = Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000, // 1 second fade-in effect
            useNativeDriver: true,
        });

        const hideSplashScreen = async () => {
            fadeIn.start(); // Start fade-in animation
            await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate loading time
            await SplashScreen.hideAsync();
        };

        hideSplashScreen();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <MaterialCommunityIcons name="car-hatchback" size={60} color="#34D399" />
            <Text style={styles.title}>RideEasy</Text>
            <Text style={styles.subtitle}>Find your perfect ride, anytime</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111827", // Dark background for a modern feel
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#34D399", // Bright green for contrast
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: "#D1D5DB",
        marginTop: 10,
    },
});

export default SplashScreenComponent;
