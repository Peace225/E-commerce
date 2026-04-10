import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MesFavoris() {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
      <Heart size={64} className="mx-auto text-gray-200 mb-6" />
      <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Aucun Favori</h2>
      <p className="text-gray-400 font-bold uppercase text-xs">Vous n'avez pas encore d'articles favoris.</p>
      <button onClick={() => navigate("/shop")} className="mt-6 bg-primary text-theme-text px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
        Explorer la boutique
      </button>
    </div>
  );
}