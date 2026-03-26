export const seasonalThemes = [
  {
    id: "easter",
    name: "Spécial Pâques",
    startDate: "03-20",
    endDate: "04-10",
    effect: "easter", // ✨ L'effet à déclencher
    colors: {
      primary: "#5D4037", 
      secondary: "#FBC02D",
      text: "#FFFFFF",
      background: "#FFF8E1" 
    },
    promoText: "🐰 PÂQUES : Chassez les bonnes affaires !"
  },
  {
    id: "christmas",
    name: "Noël",
    startDate: "12-01",
    endDate: "12-26",
    effect: "snow", // ✨ Effet neige
    colors: {
      primary: "#165B33",
      secondary: "#BB2528",
      text: "#FFFFFF",
      background: "#F0F7F4"
    },
    promoText: "🎄 Préparez vos cadeaux de Noël !"
  },
  {
    id: "independence-ci",
    name: "Indépendance CI",
    startDate: "08-01",
    endDate: "08-10",
    effect: "confetti", // ✨ Effet confettis
    colors: {
      primary: "#F97316",
      secondary: "#15803D",
      text: "#FFFFFF",
      background: "#FDFCF0"
    },
    promoText: "🇨🇮 Bonne Fête de l'Indépendance !"
  },
  {
    id: "default",
    name: "Rynek",
    effect: null, // Pas d'effet par défaut
    colors: { /* ... tes couleurs par défaut ... */ }
  }
];