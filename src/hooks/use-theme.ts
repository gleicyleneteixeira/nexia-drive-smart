import { useState, useEffect, useCallback } from 'react';
import { themes, type ThemeName, STORAGE_THEME_KEY, DEFAULT_THEME } from '@/lib/themes';

function getStoredTheme(): ThemeName {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem(STORAGE_THEME_KEY);
    if (stored && (stored === 'rosa' || stored === 'azul')) {
      return stored;
    }
  } catch {}
  return DEFAULT_THEME;
}

function applyTheme(themeName: ThemeName) {
  const theme = themes[themeName];
  if (!theme) return;
  
  const root = document.documentElement;
  Object.entries(theme.variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', themeName === 'rosa' ? '#1a1a2e' : '#1a2540');
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeName>(getStoredTheme);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    applyTheme(stored);
    setIsLoaded(true);
  }, []);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_THEME_KEY, newTheme);
    applyTheme(newTheme);
    
    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent('nexia:theme:change', { detail: { theme: newTheme } }));
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'rosa' ? 'azul' : 'rosa';
    setTheme(newTheme);
  }, [theme, setTheme]);

  const currentTheme = themes[theme];

  return {
    theme,
    setTheme,
    toggleTheme,
    currentTheme,
    isLoaded,
    themes,
  };
}
