import { motion } from "framer-motion";
import { useTheme } from "../contexte/ThemeProvider";

const Particle = ({ char, color }) => (
  <motion.div
    initial={{ y: -20, opacity: 0, x: Math.random() * window.innerWidth }}
    animate={{ 
      y: window.innerHeight + 20, 
      opacity: [0, 1, 1, 0],
      rotate: 360 
    }}
    transition={{ 
      duration: Math.random() * 5 + 5, 
      repeat: Infinity, 
      ease: "linear",
      delay: Math.random() * 10 
    }}
    style={{
      position: "fixed",
      zIndex: 50, // Entre le fond et le contenu
      pointerEvents: "none",
      color: color,
      fontSize: Math.random() * 20 + 10 + "px"
    }}
  >
    {char}
  </motion.div>
);

export default function SeasonalEffect() {
  const { currentTheme } = useTheme();
  if (!currentTheme || !currentTheme.effect) return null;

  const particles = Array.from({ length: 30 }); // Nombre de particules

  const getEffectData = () => {
    switch (currentTheme.effect) {
      case "snow": return { char: "❄️", color: "#FFF" };
      case "easter": return { char: "🥚", color: currentTheme.colors.secondary };
      case "confetti": return { char: "🎉", color: currentTheme.colors.primary };
      default: return null;
    }
  };

  const data = getEffectData();
  if (!data) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[40]">
      {particles.map((_, i) => (
        <Particle key={i} char={data.char} color={data.color} />
      ))}
    </div>
  );
}