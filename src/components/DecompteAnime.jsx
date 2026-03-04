import { useEffect, useState } from "react";

/**
 * Composant Decompte animé
 * @param {Date|string|number} targetDate - La date cible du compte à rebours
 * @param {string} label - Label à afficher au-dessus
 */
export default function DecompteAnime({ targetDate, label = "Temps restant" }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00"
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      let distance = target - now;

      if (distance <= 0) {
        clearInterval(interval);
        distance = 0;
      }

      const hours = String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, "0");
      const minutes = String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, "0");
      const seconds = String(Math.floor((distance / 1000) % 60)).padStart(2, "0");

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Calcul dynamique pour couleur et animation
  const totalSeconds =
    parseInt(timeLeft.hours) * 3600 +
    parseInt(timeLeft.minutes) * 60 +
    parseInt(timeLeft.seconds);

  let bgColor = "bg-[#276ff5]";
  let pulse = "";
  if (totalSeconds <= 600) bgColor = "bg-orange-500"; // moins de 10 min
  if (totalSeconds <= 300) {
    bgColor = "bg-red-500";    // moins de 5 min
    pulse = "animate-pulse";
  }

  return (
    <div className={`inline-block p-4 rounded-lg text-white font-mono shadow-lg ${bgColor} ${pulse} overflow-hidden`}>
      <div className="text-center font-semibold mb-2">{label}</div>
      <div className="flex justify-center gap-2 text-sm md:text-xl font-bold">
        <TimeBlock value={timeLeft.hours} label="h" />
        <span className="self-end">:</span>
        <TimeBlock value={timeLeft.minutes} label="m" />
        <span className="self-end">:</span>
        <TimeBlock value={timeLeft.seconds} label="s" />
      </div>
    </div>
  );
}

// Composant pour chaque bloc de temps avec animation hover
function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center bg-black/20 px-3 py-2 rounded-lg transform transition-transform duration-300 hover:scale-110">
      <span className="text-lg md:text-2xl">{value}</span>
      <span className="text-xs opacity-70">{label}</span>
    </div>
  );
}