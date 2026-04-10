import { MapPin, Plus } from "lucide-react";

export default function MesAdresses({ user }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Mes Adresses</h2>
        <button className="bg-primary/10 text-primary hover:bg-primary hover:text-theme-text px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-primary relative">
          <span className="absolute -top-3 left-6 bg-primary text-theme-text px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Par défaut</span>
          <div className="flex items-start gap-4 mt-2">
            <MapPin className="text-primary mt-1" size={20} />
            <div>
              <p className="font-black text-gray-900 uppercase">{user?.user_metadata?.full_name || "Client"}</p>
              <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-2">Abidjan, Côte d'Ivoire</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}