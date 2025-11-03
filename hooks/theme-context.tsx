import React, { createContext, useContext, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme as useRNColorScheme } from 'react-native';

type ThemeMode = Exclude<ColorSchemeName, null | undefined>;

type ThemeContextValue = {
  scheme: ThemeMode;
  setScheme: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const system = (useRNColorScheme() ?? 'light') as ThemeMode;
  const [override, setOverride] = useState<ThemeMode | null>(null);

  const value = useMemo<ThemeContextValue>(() => ({
    scheme: (override ?? system) as ThemeMode,
    setScheme: setOverride as (mode: ThemeMode) => void,
  }), [override, system]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeController() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeController must be used within AppThemeProvider');
  return ctx;
}
