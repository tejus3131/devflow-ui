'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'dark') return 'light';
      if (current === 'light') return 'dark';
      return resolvedTheme === 'light' ? 'dark' : 'light';
    });
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }

    const script = document.createElement('script');
    script.innerHTML = `
      document.documentElement.setAttribute(
        "data-theme",
        localStorage.theme === "dark" ||
          (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
          ? "dark" : "light"
      );
    `;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    setResolvedTheme(isDark ? 'dark' : 'light');

    if (theme === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.theme = theme;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const newIsDark = mediaQuery.matches;
        document.documentElement.setAttribute('data-theme', newIsDark ? 'dark' : 'light');
        setResolvedTheme(newIsDark ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};