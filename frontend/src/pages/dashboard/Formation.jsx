import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import jsPDF from "jspdf";
import { supabase } from "../../utils/supabaseClient";

// 🔹 DATA (À terme, tu pourras aussi les mettre en DB)
const modules = [
  { id: "mod1", title: "Le Mindset du E-commerçant", duration: "12 min", url: "https://www.youtube.com/embed/9Jk9Jk9Jk9", thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" },
  { id: "mod2", title: "Lancer sa boutique de A à Z", duration: "45 min", url: "https://www.youtube.com/embed/xJ8a2mJj9YU", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
];

const ressources = [
  { id: "doc1", title: "Guide Ultime du Dropshipping 2026", format: "PDF", size: "2.4 MB", link: "#" },
  { id: "doc2", title: "Les 50 Produits Gagnants", format: "Excel", size: "1.1 MB", link: "#" },
];

export default function Formation({ user }) {
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  // 🔄 1. CHARGEMENT DE LA PROGRESSION (SUPABASE)
  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      const { data } = await supabase
        .from('academy_progress')
        .select('module_id')
        .eq('user_id', user.id);
      
      const progressMap = {};
      data?.forEach(item => progressMap[item.module_id] = true);
      setCompleted(progressMap);
      setLoading(false);
    };
    fetchProgress();
  }, [user]);

  // ✅ 2. VALIDER UN MODULE
  const handleComplete = async (id) => {
    try {
      setCompleted(prev => ({ ...prev, [id]: true }));
      await supabase.from('academy_progress').insert([{ user_id: user.id, module_id: id }]);
    } catch (err) {
      console.error("Erreur sync:", err);
    }
  };

  // 🎓 3. GÉNÉRATION CERTIFICAT (DESIGN AMÉLIORÉ)
  const handleDownloadCertificate = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const name = user?.displayName || "Expert Rynek";

    // Bordure de Luxe
    doc.setDrawColor(249, 115, 22);
    doc.setLineWidth(5);
    doc.rect(5, 5, 287, 200);
    
    // Fond Sombre Principal
    doc.setFillColor(15, 23, 42);
    doc.rect(7, 7, 283, 196, 'F');
    
    // Texte
    doc.setTextColor(249, 115, 22);
    doc.setFont("times", "bolditalic");
    doc.setFontSize(50);
    doc.text("RYNEK ACADEMY", 148, 50, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text("CERTIFICAT DE RÉUSSITE", 148, 75, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(35);
    doc.text(name.toUpperCase(), 148, 110, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("A complété l'intégralité du cursus professionnel", 148, 135, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text("E-COMMERCE ÉLITE & AUTOMATISATION 2026", 148, 145, { align: "center" });

    // Signature factice & Cachet
    doc.setDrawColor(255, 255, 255);
    doc.line(110, 175, 186, 175);
    doc.setFontSize(10);
    doc.text("DIRECTION RYNEK PRO", 148, 182, { align: "center" });
    
    doc.save(`Diplome_Rynek_${name}.pdf`);
  };

  const totalItems = modules.length + ressources.length;
  const completedItems = Object.keys(completed).length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="space-y-10 pb-20">
      
      {/* 🔹 HEADER ACADÉMIE */}
      <header className="bg-[#0f172a] p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="space-y-4">
            <div className="bg-orange-500 text-white w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Icons.GraduationCap size={14} /> Intelligence & Savoir
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
              Rynek <span className="text-orange-500 italic">Academy</span>
            </h1>
          </div>

          {/* PROGRESS CIRCLE / BAR */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score de Maîtrise</span>
               <span className="text-orange-500 font-black text-2xl">{progressPercent}%</span>
            </div>
            <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${progressPercent}%` }} 
                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full" 
              />
            </div>
          </div>
        </div>
        <Icons.BookOpen className="absolute -right-10 -bottom-10 text-white/5 rotate-12" size={300} />
      </header>

      {/* 🔹 SECTION DIPLÔME DÉBLOQUÉ */}
      <AnimatePresence>
        {progressPercent === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-500/20"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Icons.Trophy size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Expertise Validée</h3>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Téléchargez votre preuve de compétence</p>
              </div>
            </div>
            <button onClick={handleDownloadCertificate} className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">
              Générer mon certificat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 LECTEUR VIDÉO ACTIF */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-800">
            <div className="aspect-video w-full">
              <iframe 
                src={modules.find(m => m.id === activeVideo).url + "?autoplay=1"} 
                className="w-full h-full" 
                allow="autoplay; encrypted-media" 
                allowFullScreen 
              />
            </div>
            <div className="p-6 flex justify-between items-center bg-slate-800/50 backdrop-blur-md text-white">
               <h3 className="font-black uppercase text-sm tracking-tight">{modules.find(m => m.id === activeVideo).title}</h3>
               <button onClick={() => setActiveVideo(null)} className="text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100">Fermer le lecteur</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 MODULES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="relative aspect-video cursor-pointer" onClick={() => setActiveVideo(mod.id)}>
              <img src={mod.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Icons.PlayCircle size={60} className="text-white text-glow" />
              </div>
              {completed[mod.id] && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-xl shadow-lg">
                  <Icons.CheckCircle2 size={20} />
                </div>
              )}
            </div>
            <div className="p-8">
               <h3 className="text-slate-900 font-black uppercase text-sm tracking-tight mb-4">{mod.title}</h3>
               <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Icons.Clock size={14} /> {mod.duration}
                  </span>
                  {!completed[mod.id] && (
                    <button onClick={() => handleComplete(mod.id)} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">
                      Terminer
                    </button>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}