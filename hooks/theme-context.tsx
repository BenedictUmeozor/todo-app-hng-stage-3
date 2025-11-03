import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme as useRNColorScheme } from 'react-native';

type ThemeMode = Exclude<ColorSchemeName, null | undefined>;

type ThemeContextValue = {
  scheme: ThemeMode;
  setScheme: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const THEME_STORAGE_KEY = '@theme_preference';

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const system = (useRNColorScheme() ?? 'light') as ThemeMode;
  const [override, setOverride] = useState<ThemeMode | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
          setOverride(saved);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference when it changes
  const handleSetScheme = async (mode: ThemeMode) => {
    setOverride(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const value = useMemo<ThemeContextValue>(() => ({
    scheme: (override ?? system) as ThemeMode,
    setScheme: handleSetScheme,
  }), [override, system]);

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeController() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeController must be used within AppThemeProvider');
  return ctx;
}
