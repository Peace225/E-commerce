import { createContext, useContext, useState } from "react";

// 🎨 Thèmes disponibles
const themes = {
  Minimaliste: {
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    accentColor: "#22c55e",
    fontFamily: "sans-serif",
    layout: "centered",
    buttonStyle: "bg-green-500 hover:bg-green-600 text-white rounded-full",
  },
  Élégant: {
    backgroundColor: "#f9fafb",
    textColor: "#111827",
    accentColor: "#8b5cf6",
    fontFamily: "Georgia, serif",
    layout: "spaced",
    buttonStyle: "bg-purple-600 hover:bg-purple-700 text-white rounded-md",
  },
  Dynamique: {
    backgroundColor: "#ecfdf5",
    textColor: "#065f46",
    accentColor: "#10b981",
    fontFamily: "Poppins, sans-serif",
    layout: "grid",
    buttonStyle: "bg-emerald-500 hover:bg-emerald-600 text-white rounded",
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeSelected, setThemeSelected] = useState(null);

  const applyTheme = (themeName) => {
    setThemeSelected(themes[themeName]);
  };

  return (
    <ThemeContext.Provider value={{ themeSelected, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Pour utiliser plus facilement
export const useTheme = () => useContext(ThemeContext);