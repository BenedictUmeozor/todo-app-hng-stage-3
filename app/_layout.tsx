import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Keep splash screen visible while fonts load
  SplashScreen.preventAutoHideAsync();

  const [loaded] = useFonts({
    'JosefinSans-Regular': require('@/assets/fonts/static/JosefinSans-Regular.ttf'),
    'JosefinSans-Bold': require('@/assets/fonts/static/JosefinSans-Bold.ttf'),
    'JosefinSans-SemiBold': require('@/assets/fonts/static/JosefinSans-SemiBold.ttf'),
    'JosefinSans-Light': require('@/assets/fonts/static/JosefinSans-Light.ttf'),
    'SpaceMono': require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
