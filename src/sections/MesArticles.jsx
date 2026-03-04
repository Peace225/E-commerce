import * as Icons from "lucide-react";

export default function MesArticles({ produits, onDelete, onEdit }) {
  // Sécurité si la liste est vide
  if (!produits || produits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
        <Icons.PackageOpen size={48} className="text-slate-700 mb-4" />
        <p className="text-slate-500 font-black uppercase text-xs tracking-widest">Aucun article trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {produits.map((item) => (
        <div key={item.id} className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-orange-500/50 transition-all shadow-2xl">
          {/* IMAGE */}
          <div className="h-56 relative overflow-hidden">
            <img 
              src={item.image || "https://via.placeholder.com/400x300?text=No+Image"} 
              alt={item.nom} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-2xl text-[11px] font-black shadow-xl">
              {Number(item.prix).toLocaleString()} FCFA
            </div>
          </div>

          {/* INFOS */}
          <div className="p-8">
            <h4 className="text-white font-black uppercase text-sm mb-3 tracking-tight truncate">{item.nom}</h4>
            
            <div className="flex gap-2 mb-6">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${item.isAffiliationActive ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-white/5 border-transparent text-slate-600'}`}>
                <Icons.Users size={10} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Affiliation</span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${item.isCommissionActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-transparent text-slate-600'}`}>
                <Icons.Percent size={10} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Commission</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between items-center pt-5 border-t border-white/5">
              <button 
                onClick={() => onEdit && onEdit(item)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group/btn"
              >
                <div className="p-2 bg-white/5 rounded-lg group-hover/btn:bg-orange-500 transition-colors">
                  <Icons.Edit3 size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Éditer</span>
              </button>

              <button 
                onClick={() => onDelete(item.id)}
                className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-all group/btn"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Supprimer</span>
                <div className="p-2 bg-white/5 rounded-lg group-hover/btn:bg-red-500/20 transition-colors">
                  <Icons.Trash2 size={16} />
                </div>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}