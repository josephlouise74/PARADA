import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import '../global.css'
import { useColorScheme } from '@/hooks/useColorScheme';
import SplashScreenComponent from '@/components/SplashScreen'; // Import custom splash screen
/* 
import
SplashScreen.preventAutoHideAsync();
 */


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => setIsAppReady(true), 2500); // Delay for splash screen animation
    }
  }, [loaded]);

  if (!isAppReady) {
    return <SplashScreenComponent />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
