import React, { createContext, useContext, useState, useEffect } from 'react';
import { seasonalThemes } from '../utils/themeConfig';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(null);

  useEffect(() => {
    const applyTheme = () => {
      // 📅 Date du jour (MM-DD) -> Aujourd'hui : 03-24
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const today = `${month}-${day}`;

      // 🔍 Trouve le thème correspondant ou prend le 'default'
      const activeTheme = seasonalThemes.find(theme => {
        if (theme.id === 'default') return false;
        return today >= theme.startDate && today <= theme.endDate;
      }) || seasonalThemes.find(t => t.id === 'default');

      setCurrentTheme(activeTheme);

      // 🎨 Injection des variables dans le CSS Root
      const root = document.documentElement;
      const colors = activeTheme.colors;

      root.style.setProperty('--color-primary', colors.primary);
      root.style.setProperty('--color-secondary', colors.secondary);
      root.style.setProperty('--color-text', colors.text);
      
      // ✨ NOUVEAU : On injecte la couleur de fond
      // Si 'background' n'existe pas dans le thème, on met un gris clair par défaut
      root.style.setProperty('--color-bg', colors.background || '#F3F4F6');

      // 🏷️ Classe sur le body pour des animations CSS globales
      document.body.className = `theme-${activeTheme.id} bg-theme-bg transition-colors duration-1000`;
    };

    applyTheme();
    
    // Vérification toutes les heures (utile si le client reste connecté à minuit)
    const timer = setInterval(applyTheme, 3600000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme }}>
      {/* On affiche un loader ou un fond neutre pendant le calcul pour éviter le flash blanc */}
      {currentTheme ? children : <div className="min-h-screen bg-gray-100"></div>}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé à l'intérieur d'un ThemeProvider");
  }
  return context;
};