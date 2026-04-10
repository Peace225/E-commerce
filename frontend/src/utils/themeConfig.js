// src/utils/themeConfig.js

export const seasonalThemes = [
  // --- 🌟 ÉVÉNEMENTS MAJEURS (Prioritaires) ---
  {
    id: "new-year",
    name: "Nouvel An",
    startDate: "12-30",
    endDate: "01-05",
    effect: "confetti",
    colors: { primary: "#D4AF37", secondary: "#000000", text: "#FFFFFF", background: "#FAF9F6" },
    promoText: "🎆 Bonne Année ! Commencez 2026 avec nos meilleures offres."
  },
  {
    id: "valentines",
    name: "Saint-Valentin",
    startDate: "02-07",
    endDate: "02-15",
    effect: "hearts",
    colors: { primary: "#E11D48", secondary: "#FB7185", text: "#FFFFFF", background: "#FFF1F2" },
    promoText: "❤️ Offrez de l'amour à prix réduit pour la Saint-Valentin."
  },
  {
    id: "womens-day",
    name: "Droits des Femmes",
    startDate: "03-05",
    endDate: "03-10",
    effect: "stars",
    colors: { primary: "#7C3AED", secondary: "#C084FC", text: "#FFFFFF", background: "#F5F3FF" },
    promoText: "💜 Honneur aux femmes : remises spéciales sur toute la boutique."
  },
  {
    id: "easter",
    name: "Pâques",
    startDate: "03-25",
    endDate: "04-06",
    effect: "easter",
    colors: { primary: "#5D4037", secondary: "#FBC02D", text: "#FFFFFF", background: "#FFF8E1" },
    promoText: "🐰 Joyeuses Pâques ! Chassez les réductions."
  },
  {
    id: "labor-day",
    name: "Fête du Travail",
    startDate: "04-28",
    endDate: "05-02",
    effect: "confetti",
    colors: { primary: "#1D4ED8", secondary: "#F59E0B", text: "#FFFFFF", background: "#EFF6FF" },
    promoText: "🛠️ Fête du Travail : Reposez-vous, on s'occupe de vos courses."
  },
  {
    id: "mothers-day",
    name: "Fête des Mères",
    startDate: "05-15",
    endDate: "05-31",
    effect: "hearts",
    colors: { primary: "#DB2777", secondary: "#FBCFE8", text: "#FFFFFF", background: "#FDF2F8" },
    promoText: "🌸 Un cadeau unique pour une maman unique."
  },
  {
    id: "tabaski",
    name: "Tabaski",
    startDate: "05-20", 
    endDate: "05-30",
    effect: "stars",
    colors: { primary: "#065F46", secondary: "#D97706", text: "#FFFFFF", background: "#ECFDF5" },
    promoText: "🌙 Préparez la Tabaski avec nos sélections spéciales."
  },
  {
    id: "independence-ci",
    name: "Indépendance CI",
    startDate: "08-01",
    endDate: "08-10",
    effect: "confetti",
    colors: { primary: "#F97316", secondary: "#15803D", text: "#FFFFFF", background: "#FDFCF0" },
    promoText: "🇨🇮 Fier d'être Ivoirien ! Bonne fête de l'Indépendance."
  },
  {
    id: "back-to-school",
    name: "Rentrée Scolaire",
    startDate: "08-25",
    endDate: "09-15",
    effect: null,
    colors: { primary: "#0369A1", secondary: "#FACC15", text: "#FFFFFF", background: "#F0F9FF" },
    promoText: "📚 C'est la rentrée ! Équipez vos enfants au meilleur prix."
  },
  {
    id: "black-friday",
    name: "Black Friday",
    startDate: "11-15",
    endDate: "11-30",
    effect: "stars",
    colors: { primary: "#000000", secondary: "#D4AF37", text: "#FFFFFF", background: "#111827" },
    promoText: "🖤 BLACK FRIDAY : Des prix de folie sur tout !"
  },
  {
    id: "christmas",
    name: "Noël",
    startDate: "12-01",
    endDate: "12-26",
    effect: "snow",
    colors: { primary: "#165B33", secondary: "#BB2528", text: "#FFFFFF", background: "#F0F7F4" },
    promoText: "🎄 Noël Magique : Trouvez le cadeau idéal."
  },

  // --- 📅 THÈMES MENSUELS (Si aucun événement n'est actif) ---
  { id: "month-01", name: "Janvier", startDate: "01-01", endDate: "01-31", colors: { primary: "#1E40AF", secondary: "#3B82F6", text: "#FFFFFF", background: "#F8FAFC" } },
  { id: "month-02", name: "Février", startDate: "02-01", endDate: "02-28", colors: { primary: "#BE185D", secondary: "#F472B6", text: "#FFFFFF", background: "#FFF1F2" } },
  { id: "month-03", name: "Mars", startDate: "03-01", endDate: "03-31", colors: { primary: "#047857", secondary: "#10B981", text: "#FFFFFF", background: "#ECFDF5" } },
  { id: "month-04", name: "Avril", startDate: "04-01", endDate: "04-30", colors: { primary: "#B45309", secondary: "#F59E0B", text: "#FFFFFF", background: "#FFFBEB" } },
  { id: "month-05", name: "Mai", startDate: "05-01", endDate: "05-31", colors: { primary: "#4338CA", secondary: "#6366F1", text: "#FFFFFF", background: "#EEF2FF" } },
  { id: "month-06", name: "Juin", startDate: "06-01", endDate: "06-30", colors: { primary: "#0369A1", secondary: "#0EA5E9", text: "#FFFFFF", background: "#F0F9FF" } },
  { id: "month-07", name: "Juillet", startDate: "07-01", endDate: "07-31", colors: { primary: "#C2410C", secondary: "#F97316", text: "#FFFFFF", background: "#FFF7ED" } },
  { id: "month-08", name: "Août", startDate: "08-01", endDate: "08-31", colors: { primary: "#15803D", secondary: "#22C55E", text: "#FFFFFF", background: "#F0FDF4" } },
  { id: "month-09", name: "Septembre", startDate: "09-01", endDate: "09-30", colors: { primary: "#6D28D9", secondary: "#8B5CF6", text: "#FFFFFF", background: "#F5F3FF" } },
  { id: "month-10", name: "Octobre", startDate: "10-01", endDate: "10-31", colors: { primary: "#EA580C", secondary: "#FB923C", text: "#FFFFFF", background: "#FFF7ED" } },
  { id: "month-11", name: "Novembre", startDate: "11-01", endDate: "11-30", colors: { primary: "#374151", secondary: "#6B7280", text: "#FFFFFF", background: "#F9FAFB" } },
  { id: "month-12", name: "Décembre", startDate: "12-01", endDate: "12-31", colors: { primary: "#B91C1C", secondary: "#EF4444", text: "#FFFFFF", background: "#FEF2F2" } },

  // --- 💻 PAR DÉFAUT : THEME MATRIX ---
  {
    id: "default",
    name: "Rynek Matrix",
    effect: null,
    colors: { 
      primary: "#10B981",     // Vert vif fluorescent (Boutons, Topbar)
      secondary: "#047857",   // Vert sombre pour les contrastes
      text: "#D1FAE5",        // Vert très clair (presque blanc) pour un texte ultra-lisible
      background: "#052E16"   // Fond vert extrêmement sombre, presque noir
    }
  }
];

export const getCurrentTheme = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const currentDate = `${month}-${day}`;

  // 1. Chercher d'abord un événement majeur
  const eventTheme = seasonalThemes.find(theme => {
    if (theme.id.startsWith("month-") || theme.id === "default") return false;
    return currentDate >= theme.startDate && currentDate <= theme.endDate;
  });

  if (eventTheme) return eventTheme;

  // 2. Si pas d'événement, chercher le thème du mois
  const monthTheme = seasonalThemes.find(theme => theme.id === `month-${month}`);
  if (monthTheme) return monthTheme;

  // 3. Fallback sur le thème par défaut
  return seasonalThemes.find(theme => theme.id === "default");
};