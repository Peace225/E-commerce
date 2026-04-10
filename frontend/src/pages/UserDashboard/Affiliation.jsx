import { Share2 } from "lucide-react";

export default function Affiliation({ userData }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
      <Share2 size={64} className="mx-auto text-primary/20 mb-6" />
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 text-gray-900">Programme d'Affiliation</h2>
      <p className="text-gray-500 text-xs font-bold mb-8 max-w-md mx-auto leading-relaxed">
        Partagez ce code avec vos proches. Ils obtiennent une réduction, et vous gagnez des commissions directes dans votre Wallet !
      </p>
      <div className="bg-primary/5 border-2 border-dashed border-primary/30 p-6 rounded-3xl flex flex-col items-center justify-center gap-4 max-w-sm mx-auto">
        <span className="text-sm font-black text-primary/70 uppercase tracking-widest">Votre Code Parrain</span>
        <span className="text-3xl font-black text-primary tracking-widest">{userData?.referral_code || "RYNEK-PRO"}</span>
        <button className="bg-primary text-theme-text px-8 py-4 rounded-2xl text-xs font-black uppercase hover:opacity-90 shadow-xl shadow-primary/20 transition-all mt-2 w-full active:scale-95">
          Copier le lien
        </button>
      </div>
    </div>
  );
}