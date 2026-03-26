import React, { createContext, useContext, useState, useEffect } from 'react';
import { seasonalThemes } from '../utils/themeConfig';

const SeasonContext = createContext();

export const SeasonProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(null);

  useEffect(() => {
    const updateTheme = () => {
      const now = new Date();
      const monthDay = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      // 🔍 On cherche si aujourd'hui correspond à un événement
      const activeTheme = seasonalThemes.find(theme => {
        if (!theme.startDate || !theme.endDate) return false;
        return monthDay >= theme.startDate && monthDay <= theme.endDate;
      }) || seasonalThemes.find(t => t.id === 'default');

      setCurrentTheme(activeTheme);

      // 🎨 On injecte les variables CSS directement dans le document
      const root = document.documentElement;
      root.style.setProperty('--color-primary', activeTheme.colors.primary);
      root.style.setProperty('--color-secondary', activeTheme.colors.secondary);
      root.style.setProperty('--color-text', activeTheme.colors.text);
    };

    updateTheme();
  }, []);

  return (
    <SeasonContext.Provider value={{ currentTheme }}>
      {currentTheme && children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => useContext(SeasonContext);