import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MesBons() {
  const [bons, setBons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  
  // 🔹 États pour la Modale de Création
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "Réduction",
    valeur: "",
    expiry: "",
    desc: ""
  });

  // Simulation de la base de données initiale
  useEffect(() => {
    const data = [
      { id: 1, code: "RYNEK-WELCOME", type: "Réduction", valeur: "-10%", statut: "Actif", expiry: "2026-04-15", desc: "Applicable sur toute la boutique" },
      { id: 2, code: "VIP-CREDIT", type: "Crédit", valeur: "5 000 F", statut: "Actif", expiry: "2026-05-01", desc: "Crédit portefeuille direct" },
      { id: 3, code: "BLACK-FRIDAY", type: "Réduction", valeur: "-20%", statut: "Expiré", expiry: "2026-01-31", desc: "Événement spécial" }
    ];
    setBons(data);
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // 🔹 Fonction pour gérer la soumission du formulaire
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    
    // Création du nouvel objet coupon
    const couponToAdd = {
      id: Date.now(), // Génère un ID unique temporaire
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      valeur: newCoupon.type === "Réduction" ? `-${newCoupon.valeur}%` : `${newCoupon.valeur} F`,
      statut: "Actif", // Par défaut, un nouveau coupon est actif
      expiry: newCoupon.expiry,
      desc: newCoupon.desc
    };

    // Mise à jour de la liste
    setBons([couponToAdd, ...bons]);
    
    // Réinitialisation et fermeture
    setNewCoupon({ code: "", type: "Réduction", valeur: "", expiry: "", desc: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* 🔹 HEADER BONS & COUPONS */}
      <header className="bg-[#0f172a] p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="bg-orange-500/20 text-orange-500 w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto md:mx-0 mb-4 border border-orange-500/20">
              Marketing & Fidélisation
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              Bons & <span className="text-orange-500">Coupons</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-3 italic">
              Boostez vos ventes avec des offres exclusives
            </p>
          </div>
          
          {/* Bouton d'ouverture de la modale */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/20 font-black uppercase text-[10px] tracking-widest flex items-center gap-3"
          >
            <Icons.Plus size={16} /> Créer un coupon
          </button>
        </div>
        
        <Icons.Ticket className="absolute -right-10 -bottom-10 text-white/5 rotate-[-15deg]" size={250} />
      </header>

      {/* 🔹 GRILLE DES TICKETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {bons.map((b, i) => {
            const isActif = b.statut === "Actif";
            
            return (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={b.id} 
                className={`relative bg-white rounded-[2.5rem] p-8 border shadow-sm group transition-all
                  ${isActif ? "border-slate-100 hover:border-orange-500/30 hover:shadow-xl" : "border-slate-100 opacity-60 grayscale hover:grayscale-0"}`}
              >
                {/* Effet "Ticket de cinéma" */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#f8fafc] rounded-full border-r border-slate-100" />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#f8fafc] rounded-full border-l border-slate-100" />

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border
                    ${isActif ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {b.statut}
                  </span>
                  <div className={`p-3 rounded-xl ${isActif ? "bg-orange-50 text-orange-500" : "bg-slate-50 text-slate-400"}`}>
                    {b.type === "Réduction" ? <Icons.Percent size={20} /> : <Icons.Gift size={20} />}
                  </div>
                </div>

                <div className="relative z-10 mb-6 text-center">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{b.valeur}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.desc}</p>
                </div>

                <div className="w-full border-t-2 border-dashed border-slate-100 my-6 relative z-10" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">
                    <span>Validité</span>
                    <span className={isActif ? "text-slate-900" : ""}>{b.expiry}</span>
                  </div>
                  
                  <div 
                    onClick={() => copyToClipboard(b.code)}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all active:scale-95
                      ${isActif ? "bg-slate-50 border-slate-200 hover:bg-orange-50 hover:border-orange-200" : "bg-slate-50 border-slate-100"}`}
                  >
                    <code className={`font-mono text-sm font-black tracking-widest ${isActif ? "text-orange-600" : "text-slate-400"}`}>
                      {b.code}
                    </code>
                    <button className={`${isActif ? "text-orange-500" : "text-slate-400"}`}>
                      {copiedCode === b.code ? <Icons.CheckCircle2 size={18} className="text-emerald-500" /> : <Icons.Copy size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 🔹 MODALE DE CRÉATION DE COUPON */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Overlay sombre */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Boîte de la modale */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[3rem] p-8 md:p-10 w-full max-w-lg shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter italic">Nouveau Coupon</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configurer une offre spéciale</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-red-500 transition-colors">
                  <Icons.X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-5">
                
                {/* Champ Code */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-2">Code Promo</label>
                  <div className="relative">
                    <Icons.Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: SOLDES2026"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-black uppercase text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:normal-case placeholder:font-bold placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-2">Type</label>
                    <select 
                      value={newCoupon.type}
                      onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Réduction">Pourcentage (%)</option>
                      <option value="Crédit">Montant (FCFA)</option>
                    </select>
                  </div>
                  
                  {/* Valeur */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-2">Valeur</label>
                    <input 
                      type="number" 
                      required
                      placeholder={newCoupon.type === "Réduction" ? "Ex: 20" : "Ex: 5000"}
                      value={newCoupon.valeur}
                      onChange={(e) => setNewCoupon({...newCoupon, valeur: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-black text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Date et Description */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-2">Date d'expiration</label>
                  <input 
                    type="date" 
                    required
                    value={newCoupon.expiry}
                    onChange={(e) => setNewCoupon({...newCoupon, expiry: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 px-2">Description rapide</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Valable pour les nouveaux clients"
                    value={newCoupon.desc}
                    onChange={(e) => setNewCoupon({...newCoupon, desc: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                  />
                </div>

                {/* Bouton de soumission */}
                <button type="submit" className="w-full bg-[#0f172a] hover:bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl mt-4">
                  Générer le coupon
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}