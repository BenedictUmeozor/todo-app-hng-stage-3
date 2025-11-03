import { useColorScheme as useRNColorScheme } from 'react-native';
import { useThemeController as _useThemeController } from './theme-context';

// Return the overridden scheme when available; otherwise fall back to the system scheme.
export function useColorScheme() {
	try {
		// If provider is mounted, use it
		const { scheme } = _useThemeController();
		return scheme;
	} catch {
		// Fallback when provider isn't available (e.g., tests)
		return useRNColorScheme();
	}
}
