export default function CommandesBoutique() {
  const statusClass = (status) => status === 'Livré' ? 'text-emerald-500 bg-emerald-500/10' : 'text-orange-500 bg-orange-500/10';

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          <tr>
            <th className="p-6">Client</th>
            <th className="p-6">Produit</th>
            <th className="p-6">Date</th>
            <th className="p-6">Statut</th>
          </tr>
        </thead>
        <tbody className="text-white text-sm font-bold divide-y divide-white/5">
          {[1, 2].map((i) => (
            <tr key={i} className="hover:bg-white/5 transition-colors">
              <td className="p-6 italic">Client #00{i}</td>
              <td className="p-6 uppercase">Produit Exemple</td>
              <td className="p-6 text-slate-400 text-xs">03 Mars 2026</td>
              <td className="p-6">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${statusClass('En cours')}`}>En cours</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}