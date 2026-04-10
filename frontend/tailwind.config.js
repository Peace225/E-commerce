/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 🔄 Variables parfaitement alignées avec App.jsx
        primary: "var(--color-primary, #fea928)", // L'orange par défaut
        secondary: "var(--color-secondary, #ed8900)",
        "theme-text": "var(--theme-text, #1F2937)", // Corrigé : gris foncé par défaut
        "theme-bg": "var(--theme-bg, #FFFFFF)",     // Corrigé : blanc par défaut
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        },
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // ✨ Animation pour l'agneau de Pâques (rebond doux)
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        // ❄️ Animation pour Noël (chute de neige)
        'fall': {
          '0%': { transform: 'translateY(-10vh)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0.3' },
        }
      },
      animation: {
        marquee: 'marquee 12s linear infinite',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'snow-fall': 'fall 10s linear infinite',
      },
    },
  },
  plugins: [],
}