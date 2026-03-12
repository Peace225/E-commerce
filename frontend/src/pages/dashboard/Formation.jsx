import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import jsPDF from "jspdf";

// Base de données des cours
const modules = [
  { 
    id: "mod1", 
    type: "video",
    title: "Le Mindset du E-commerçant", 
    duration: "12 min",
    url: "https://www.youtube.com/embed/9Jk9Jk9Jk9",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
  },
  { 
    id: "mod2", 
    type: "video",
    title: "Lancer sa boutique de A à Z", 
    duration: "45 min",
    url: "https://www.youtube.com/embed/xJ8a2mJj9YU",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  },
];

const ressources = [
  { 
    id: "doc1", 
    title: "Guide Ultime du Dropshipping 2026", 
    format: "PDF", 
    size: "2.4 MB",
    link: "#" 
  },
  { 
    id: "doc2", 
    title: "Les 50 Produits Gagnants (Fichier Source)", 
    format: "Excel", 
    size: "1.1 MB",
    link: "#" 
  },
];

export default function Formation({ user }) {
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("rynekAcademyProgress");
    return saved ? JSON.parse(saved) : {};
  });

  const [activeVideo, setActiveVideo] = useState(null);

  // Sauvegarde la progression localement
  useEffect(() => {
    localStorage.setItem("rynekAcademyProgress", JSON.stringify(completed));
  }, [completed]);

  const handleComplete = (id) => {
    setCompleted((prev) => ({ ...prev, [id]: true }));
  };

  // 🔥 GÉNÉRATION DU CERTIFICAT PDF AVEC NOM DE L'UTILISATEUR
  const handleDownloadCertificate = () => {
    const doc = new jsPDF('landscape');
    const studentName = user?.displayName || "Ambassadeur Rynek";
    
    // Design du certificat
    doc.setFillColor(15, 23, 42); // Fond sombre
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setTextColor(249, 115, 22); // Orange Rynek
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICAT D'EXCELLENCE", 148, 60, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("décerné avec fierté à", 148, 85, { align: "center" });

    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text(studentName, 148, 110, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Pour avoir complété avec succès la formation intégrale", 148, 135, { align: "center" });
    doc.text("SYSTÈME E-COMMERCE & AUTOMATISATION", 148, 145, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(`Date d'obtention : ${new Date().toLocaleDateString('fr-FR')}`, 148, 180, { align: "center" });
    
    doc.save(`Certificat_Rynek_${studentName.replace(/\s+/g, '_')}.pdf`);
  };

  const totalItems = modules.length + ressources.length;
  const completedItems = Object.keys(completed).length;
  const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return (
    <div className="space-y-10 pb-20">
      
      {/* 🔹 HEADER ACADÉMIE */}
      <header className="bg-[#0f172a] p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="text-center lg:text-left space-y-4">
            <div className="bg-orange-500 text-white w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto lg:mx-0 shadow-lg shadow-orange-500/20 flex items-center gap-2">
              <Icons.GraduationCap size={14} /> Rynek Academy
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              Centre de <span className="text-orange-500">Formation</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] max-w-md italic">
              Apprenez les stratégies des meilleurs e-commerçants.
            </p>
          </div>

          {/* BARRE DE PROGRESSION GLOBALE */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 w-full max-w-sm flex flex-col justify-center">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Votre progression</p>
                <h2 className="text-3xl font-black text-white leading-none">{progress}%</h2>
              </div>
              {progress === 100 && <Icons.Award className="text-orange-500" size={32} />}
            </div>
            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-orange-600 to-orange-400" />
            </div>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-3 text-right">
              {completedItems} sur {totalItems} modules validés
            </p>
          </div>
        </div>
        <Icons.PlayCircle className="absolute -left-10 -bottom-10 text-white/5 rotate-12" size={300} />
      </header>

      {/* 🔹 CERTIFICAT DÉBLOQUÉ (S'affiche si 100%) */}
      <AnimatePresence>
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <Icons.Trophy size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Félicitations !</h3>
                <p className="text-xs font-bold text-orange-100 uppercase tracking-widest">Vous êtes désormais certifié(e) par Rynek Academy.</p>
              </div>
            </div>
            <button 
              onClick={handleDownloadCertificate}
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-xl flex items-center gap-3"
            >
              <Icons.Download size={16} /> Obtenir mon diplôme
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 MODULES VIDÉOS */}
      <div>
        <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 flex items-center gap-2 mb-6 px-2">
          <Icons.Video size={20} className="text-orange-500" /> Masterclass Vidéos
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {modules.map((mod) => {
            const isDone = completed[mod.id];
            const isPlaying = activeVideo === mod.id;

            return (
              <div key={mod.id} className={`bg-white rounded-[2.5rem] border shadow-sm overflow-hidden transition-all duration-300 ${isDone ? 'border-orange-500/30 ring-4 ring-orange-50' : 'border-slate-100 hover:shadow-xl'}`}>
                
                {/* Miniature ou Lecteur Vidéo */}
                <div className="aspect-video bg-slate-900 relative group cursor-pointer" onClick={() => setActiveVideo(mod.id)}>
                  {isPlaying ? (
                    <iframe src={mod.url} title={mod.title} frameBorder="0" allowFullScreen className="w-full h-full" />
                  ) : (
                    <>
                      <img src={mod.thumbnail} alt={mod.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-orange-500/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                          <Icons.Play size={24} className="ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-black tracking-widest">
                        {mod.duration}
                      </div>
                    </>
                  )}
                </div>

                {/* Infos du cours */}
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">{mod.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Module Vidéo</p>
                  </div>
                  
                  {isDone ? (
                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      <Icons.CheckCircle2 size={16} /> Validé
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleComplete(mod.id)}
                      className="bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                      Marquer terminé
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔹 RESSOURCES & DOCUMENTS */}
      <div>
        <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 flex items-center gap-2 mb-6 px-2 mt-4">
          <Icons.FolderArchive size={20} className="text-orange-500" /> Centre de Ressources
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ressources.map((doc) => {
            const isDone = completed[doc.id];

            return (
              <div key={doc.id} className={`bg-white rounded-[2rem] p-6 border shadow-sm flex items-center justify-between transition-all ${isDone ? 'border-orange-500/30' : 'border-slate-100 hover:border-slate-300'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${doc.format === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    <Icons.FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight">{doc.title}</h4>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-0.5 rounded-md">{doc.format}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-0.5 rounded-md">{doc.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <a href={doc.link} download className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors flex items-center justify-center">
                    <Icons.Download size={16} />
                  </a>
                  {!isDone && (
                    <button onClick={() => handleComplete(doc.id)} className="text-[8px] font-black uppercase text-orange-500 hover:underline tracking-widest text-center">
                      Valider
                    </button>
                  )}
                  {isDone && <Icons.CheckCircle2 size={14} className="text-emerald-500 mx-auto" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}