import { Wallet, Gift } from "lucide-react";

export default function MonWallet({ userData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet size={120} /></div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Solde Commissions</h3>
        <p className="text-4xl font-black tracking-tighter mb-2">
          {userData?.balance?.toLocaleString() || 0} <span className="text-lg text-primary">FCFA</span>
        </p>
        <p className="text-xs text-gray-400 mb-6 font-medium">Utilisable uniquement sur vos prochains achats Rynek.</p>
        
        <button 
          onClick={() => alert("Fonction de génération de bon d'achat en cours de développement")} 
          className="bg-primary hover:opacity-90 text-theme-text px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 w-full md:w-auto"
        >
          Convertir en Bon d'Achat
        </button>
      </div>
      
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
        <Gift size={48} className="text-primary/40 mb-4" />
        <h3 className="text-sm font-black uppercase tracking-widest mb-1">Points Fidélité</h3>
        <p className="text-3xl font-black text-primary mb-2">{userData?.bonus_balance || 0} PTS</p>
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Échangeables dans la boutique Cadeaux</p>
      </div>
    </div>
  );
}