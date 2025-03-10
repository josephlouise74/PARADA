import React, { useEffect } from "react";
import { AccessibilityInfo, Platform, LayoutAnimation } from "react-native";
import { Stack, useSegments, useRouter, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import { useColorScheme } from "@/hooks/useColorScheme";

import '../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const checkReduceMotion = async () => {
      const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      if (Platform.OS === "ios" && !isReduceMotionEnabled) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
    };

    checkReduceMotion();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <NavigationGuard>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Welcome & Authentication */}
          <Stack.Screen name="(auth)/welcome" />
          <Stack.Screen name="(auth)/signin" />
          <Stack.Screen name="(auth)/signup" />
          <Stack.Screen name="(auth)/forgotPassword" />
          <Stack.Screen name="(students)/home" />
          <Stack.Screen name="(students)/profile" />
          <Stack.Screen name="(students)/enterRoom" />
          <Stack.Screen name="(students)/room/:roomId" />
          {/* Strand Overview */}
          <Stack.Screen name="(overview)/strand-info" />

          {/* Main Options */}
          <Stack.Screen name="(main)/start-assessment" />
          <Stack.Screen name="(main)/enterRoom" />
          <Stack.Screen name="(main)/enter-room" />

          {/* Assessment Phase */}
          <Stack.Screen name="(assessment)/questions" />

          {/* Results & Insights */}
          <Stack.Screen name="(results)/assessment-results" />
          <Stack.Screen name="(results)/room-results" />

          {/* Error Handling */}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </NavigationGuard>
    </ThemeProvider>
  );
}

function NavigationGuard({ children }: { children: React.ReactNode }) {

  useEffect(() => {

    const test = true
    if (test) {
      if (!test) router.replace("/(auth)/signup");
    } else {
      if (test) {
        router.replace("/(customer)/home");
      }
    }
  }, [router,]);

  return <>{children}</>;
}
