const getCurrentHoliday = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // Jan = 1, Dec = 12
  const day = now.getDate();

  // 🎄 Noël : du 1er au 31 décembre
  if (month === 12) return 'christmas';

  // 🐑 Pâques : Calcul automatique pour 2026 (le 5 Avril)
  // Pour faire simple, on active la déco du 25 mars au 10 avril
  if (month === 3 && day >= 25) return 'easter';
  if (month === 4 && day <= 10) return 'easter';

  return null; // Pas de fête en cours
};