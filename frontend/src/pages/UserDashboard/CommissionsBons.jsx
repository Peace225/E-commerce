import { Gift, Tag } from "lucide-react";

export default function CommissionsBons({ userData }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
        <Gift size={48} className="mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2 text-gray-900">Vos Bons d'Achats</h2>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">Convertissez vos points en réductions</p>
        
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 inline-block">
          <p className="text-4xl font-black text-primary">{userData?.bonus_balance || 0} PTS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exemple de bon d'achat vide */}
        <div className="bg-white p-6 rounded-[2rem] border border-dashed border-gray-200 flex items-center gap-4 opacity-50">
          <div className="bg-gray-100 p-4 rounded-xl"><Tag size={24} className="text-gray-400" /></div>
          <div>
            <p className="font-black uppercase text-gray-900">Aucun bon actif</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Convertissez vos points pour commencer</p>
          </div>
        </div>
      </div>
    </div>
  );
}