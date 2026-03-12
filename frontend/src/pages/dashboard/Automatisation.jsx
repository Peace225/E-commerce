import { useState } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 🔹 Composant Switch iOS pour les Boosters
const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${
      enabled ? 'bg-orange-500' : 'bg-slate-200'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out ${
        enabled ? 'translate-x-8' : 'translate-x-1'
      }`}
    />
  </button>
);

export default function Automatisation() {
  // 📦 1. ÉTATS : COMMANDES DROPSHIPPING
  const [commandes, setCommandes] = useState([
    { id: 1, produit: "Montre Connectée Z", fournisseur: "AliExpress", plateforme: "Shopify", statut: "En transit", prix: 15000, date: "2026-03-01", tracking: { step: 2, number: "TRK-849201" } },
    { id: 2, produit: "Sneakers Urban", fournisseur: "CJdropshipping", plateforme: "WooCommerce", statut: "Livrée", prix: 22000, date: "2026-02-28", tracking: { step: 4, number: "TRK-552190" } },
    { id: 3, produit: "Écouteurs sans fil", fournisseur: "AliExpress", plateforme: "Rynek Store", statut: "En attente", prix: 12000, date: "2026-03-03", tracking: { step: 1, number: "TRK-993021" } }
  ]);
  const [loading, setLoading] = useState(false);
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [progress, setProgress] = useState(0);

  // 🚀 2. ÉTATS : BOOSTERS DE VENTES
  const [boosters, setBoosters] = useState([
    { id: 1, nom: "Relance WhatsApp Automatique", desc: "Relance les paniers abandonnés après 2h.", icon: <Icons.MessageCircle size={20}/>, color: "text-emerald-500", bg: "bg-emerald-50", active: true },
    { id: 2, nom: "Upsell Post-Achat (Email)", desc: "Propose un produit complémentaire avec -10%.", icon: <Icons.Mail size={20}/>, color: "text-blue-500", bg: "bg-blue-50", active: false },
    { id: 3, nom: "Booster d'Avis Clients", desc: "Demande un avis 3 jours après la livraison.", icon: <Icons.Star size={20}/>, color: "text-yellow-500", bg: "bg-yellow-50", active: true },
  ]);

  // 🔌 3. ÉTATS : PLATEFORMES CONNECTÉES
  const plateformes = [
    { nom: "Shopify", statut: "Connecté", color: "bg-green-100 text-green-600" },
    { nom: "WooCommerce", statut: "Connecté", color: "bg-purple-100 text-purple-600" },
    { nom: "Amazon FBA", statut: "Non connecté", color: "bg-slate-100 text-slate-400" },
  ];

  // ⚙️ FONCTION : IMPORTATION DES COMMANDES
  const handleImportCommande = async () => {
    setLoading(true);
    setProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 15;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        
        const nouvelleCommande = {
          id: commandes.length + 1,
          produit: "Smart Ring Elite",
          fournisseur: "Auto-Sync",
          plateforme: "Shopify",
          statut: "En attente",
          prix: 18000,
          date: new Date().toISOString().split('T')[0],
          tracking: { step: 1, number: `TRK-${Math.floor(Math.random() * 900000) + 100000}` },
        };
        
        setCommandes(prev => [nouvelleCommande, ...prev]);
        setLoading(false);
      }
    }, 150);
  };

  const toggleBooster = (id) => {
    setBoosters(boosters.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const commandesFiltrees = filterStatut === "Tous" ? commandes : commandes.filter(cmd => cmd.statut === filterStatut);
  const statusStyles = {
    "Livrée": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "En transit": "bg-blue-50 text-blue-600 border-blue-100",
    "En attente": "bg-orange-50 text-orange-600 border-orange-100"
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* 🔹 HEADER : LOGISTIQUE & BOOST */}
      <header className="bg-[#0f172a] p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="text-center lg:text-left space-y-4">
            <div className="bg-orange-500 text-white w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto lg:mx-0 shadow-lg shadow-orange-500/20 flex items-center gap-2">
              <Icons.Zap size={14} className="fill-white" /> Intelligence Artificielle & Sync
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              Auto-Pilote & <span className="text-orange-500">Boosters</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] max-w-lg italic">
              Connectez vos boutiques, synchronisez vos commandes et laissez nos algorithmes booster vos ventes.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 w-full max-w-md flex flex-col items-center justify-center">
            {loading ? (
              <div className="w-full space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-orange-500">
                  <span>Recherche multi-plateformes...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-orange-500" />
                </div>
              </div>
            ) : (
              <button 
                onClick={handleImportCommande}
                className="w-full bg-white text-black hover:bg-orange-500 hover:text-white px-8 py-5 rounded-2xl transition-all active:scale-95 shadow-xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 group"
              >
                <Icons.RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" /> 
                Synchroniser Tout
              </button>
            )}
          </div>
        </div>
        <Icons.Activity className="absolute -left-10 -bottom-10 text-white/5 rotate-12" size={300} />
      </header>

      {/* 🔹 SECTION 1 : PLATEFORMES ET BOOSTERS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Intégrations Plateformes */}
        <div className="xl:col-span-1 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
           <h3 className="font-black uppercase text-xs tracking-tighter text-slate-900 mb-6 flex items-center gap-2">
             <Icons.Link size={18} className="text-blue-500" /> Boutiques Connectées
           </h3>
           <div className="space-y-4">
             {plateformes.map((p, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                 <span className="font-black text-sm text-slate-700">{p.nom}</span>
                 <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${p.color}`}>
                   {p.statut}
                 </span>
               </div>
             ))}
             <button className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center justify-center gap-2">
               <Icons.Plus size={16} /> Ajouter une boutique
             </button>
           </div>
        </div>

        {/* Boosters de Ventes */}
        <div className="xl:col-span-2 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-black uppercase text-xs tracking-tighter text-slate-900 flex items-center gap-2">
               <Icons.Rocket size={18} className="text-orange-500" /> Boosters de Ventes
             </h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {boosters.map((b) => (
               <div key={b.id} className={`p-6 rounded-[2rem] border transition-all ${b.active ? 'border-orange-200 bg-orange-50/30' : 'border-slate-100 bg-slate-50/50'}`}>
                 <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-xl ${b.bg} ${b.color}`}>{b.icon}</div>
                   <ToggleSwitch enabled={b.active} onChange={() => toggleBooster(b.id)} />
                 </div>
                 <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight mb-1">{b.nom}</h4>
                 <p className="text-[10px] font-bold text-slate-500 leading-relaxed">{b.desc}</p>
               </div>
             ))}
           </div>
        </div>

      </div>

      {/* 🔹 SECTION 2 : LOGISTIQUE (TABLEAU DES COMMANDES) */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden mt-8">
        
        {/* En-tête du tableau + Filtres */}
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <h3 className="font-black uppercase text-xs tracking-tighter text-slate-900 flex items-center gap-2">
            <Icons.Package size={18} className="text-slate-500" /> Flux Logistique Global
          </h3>
          <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar">
            {["Tous", "En attente", "En transit", "Livrée"].map((statut) => (
              <button
                key={statut}
                onClick={() => setFilterStatut(statut)}
                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${filterStatut === statut ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {statut}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Produit & Tracking</th>
                <th className="p-8">Boutique (Source)</th>
                <th className="p-8">Coût d'achat</th>
                <th className="p-8 text-right">Statut Logistique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {commandesFiltrees.map((cmd, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    key={cmd.id} 
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                          <Icons.Box size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 uppercase text-xs tracking-tight">{cmd.produit}</span>
                          <span className="text-[10px] text-orange-500 font-bold tracking-widest mt-1 font-mono">
                            {cmd.tracking.number}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                           {cmd.plateforme}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                          <Icons.ArrowRight size={10}/> via {cmd.fournisseur}
                        </span>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="text-slate-900 font-black text-sm">{cmd.prix.toLocaleString()} <small className="text-[10px] opacity-50">FCFA</small></span>
                    </td>
                    <td className="p-8 text-right">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusStyles[cmd.statut]}`}>
                        {cmd.statut}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {commandesFiltrees.length === 0 && (
          <div className="p-24 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
              <Icons.Inbox size={32} className="text-slate-300" />
            </div>
            <h4 className="text-slate-900 font-black uppercase text-xs mb-2">Aucune commande trouvée</h4>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Synchronisez vos boutiques pour importer les commandes.</p>
          </div>
        )}
      </div>

    </div>
  );
}