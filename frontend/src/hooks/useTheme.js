// src/hooks/useTheme.js
import { useState, useEffect } from 'react';

export function useTheme(defaultDark = true) {
  const [isDarkMode, setIsDarkMode] = useState(defaultDark);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return { isDarkMode, setIsDarkMode };
}