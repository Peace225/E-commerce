/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors:{
        primary: "#fea928",
        secondary:"#ed8900"
      },

      container:{
        center: true,
        padding:{
          DEFAULT:"1rem",
          sm:"3rem",
        },
      },

      // 🔥 AJOUT ANIMATION MARQUEE
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },

      animation: {
        marquee: 'marquee 12s linear infinite',
      },
    },
  },
  plugins: [],
}
