import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient"; // 🔄 Import Supabase

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");

  // États pour la modale de Chat / Réponse
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // 🔄 SYNCHRONISATION DES TICKETS AVEC SUPABASE
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .order('updated_at', { ascending: false }); // Utilisation de updated_at

        if (error) throw error;
        if (data) setTickets(data);
      } catch (error) {
        console.error("Erreur chargement des tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();

    // ⚡ Souscription temps réel
    const channel = supabase.channel('admin-support-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
        fetchTickets();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ⚙️ CHANGER LE STATUT D'UN TICKET
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;
      
      // Mettre à jour l'état local du ticket sélectionné si la modale est ouverte
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Erreur statut:", error);
      alert("❌ Erreur lors de la mise à jour du statut.");
    }
  };

  // 💬 ENVOYER UNE RÉPONSE ADMIN
  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsReplying(true);

    const newMessage = {
      sender: "admin",
      text: replyText,
      created_at: new Date().toISOString()
    };

    try {
      // 1. Récupérer les messages actuels (géré comme un tableau JSONB dans Supabase)
      const currentMessages = selectedTicket.messages || [];
      const updatedMessages = [...currentMessages, newMessage];

      // 2. Mettre à jour la base de données
      const { error } = await supabase
        .from('tickets')
        .update({
          messages: updatedMessages,
          status: "En cours", // Passe automatiquement en cours quand l'admin répond
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedTicket.id);

      if (error) throw error;
      
      // 3. Mettre à jour la vue locale pour voir le message immédiatement
      setSelectedTicket(prev => ({
        ...prev,
        status: "En cours",
        messages: updatedMessages
      }));
      setReplyText("");
    } catch (error) {
      console.error("Erreur réponse:", error);
      alert("❌ Impossible d'envoyer le message.");
    } finally {
      setIsReplying(false);
    }
  };

  // 🔍 FILTRAGE (Sécurisé pour les noms de variables)
  const filteredTickets = tickets.filter(t => {
    const email = t.user_email || t.userEmail || "";
    const subject = t.subject || t.sujet || "";
    
    const matchesSearch = email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "Tous" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // 📊 KPIs
  const stats = {
    total: tickets.length,
    nouveaux: tickets.filter(t => t.status === "Ouvert").length,
    enCours: tickets.filter(t => t.status === "En cours").length,
    resolus: tickets.filter(t => t.status === "Résolu").length,
  };

  const statusColors = {
    "Ouvert": "bg-red-500/10 text-red-500 border-red-500/20",
    "En cours": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "Résolu": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      
      {/* 🔹 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Tickets Totaux", val: stats.total, icon: <Icons.Inbox />, col: "text-blue-500" },
          { label: "Nouveaux (Urgents)", val: stats.nouveaux, icon: <Icons.AlertCircle />, col: "text-red-500" },
          { label: "En traitement", val: stats.enCours, icon: <Icons.Clock />, col: "text-orange-500" },
          { label: "Dossiers Résolus", val: stats.resolus, icon: <Icons.CheckCircle2 />, col: "text-emerald-500" },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f172a] p-6 rounded-[2rem] border border-white/5 shadow-2xl flex items-center gap-5">
            <div className={`p-4 rounded-2xl bg-white/5 ${s.col}`}>{s.icon}</div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-xl font-black text-white">{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 HEADER & FILTRES */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Support <span className="text-red-500">Client</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Service Après-Vente & Réclamations
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" placeholder="Email, Sujet ou N° Ticket..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-white focus:border-red-500 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 bg-[#0f172a] p-1.5 rounded-2xl border border-white/5 shadow-inner overflow-x-auto custom-scrollbar">
            {["Tous", "Ouvert", "En cours", "Résolu"].map((s) => (
              <button
                key={s} onClick={() => setFilterStatus(s)}
                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${filterStatus === s ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-slate-500 hover:text-white"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 TABLEAU DES TICKETS */}
      <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Client</th>
                <th className="p-8">Sujet du Ticket</th>
                <th className="p-8 text-center">Date MAJ</th>
                <th className="p-8 text-center">Statut</th>
                <th className="p-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredTickets.map((t, i) => {
                  const dateString = t.updated_at || t.updatedAt;
                  const dateObj = dateString ? new Date(dateString) : new Date();

                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      key={t.id} className={`hover:bg-white/[0.02] transition-colors group ${t.status === 'Résolu' ? 'opacity-50 hover:opacity-100' : ''}`}
                    >
                      <td className="p-8">
                        <div className="flex flex-col">
                          <span className="font-black text-white text-xs uppercase tracking-tight">{t.user_name || t.userName || "Client"}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{t.user_email || t.userEmail}</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-300 truncate max-w-[250px]">{t.subject || t.sujet}</span>
                          <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase">ID: {t.id.slice(0, 8)}</span>
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <span className="text-slate-400 font-bold text-[10px] italic">
                          {dateObj.toLocaleDateString('fr-FR')} à {dateObj.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </td>
                      <td className="p-8 text-center">
                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusColors[t.status] || 'bg-slate-500/10 text-slate-500'}`}>
                          {t.status || "Ouvert"}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <button 
                          onClick={() => setSelectedTicket(t)}
                          className="px-6 py-3 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg inline-flex items-center gap-2"
                        >
                          <Icons.MessageSquare size={14} /> Traiter
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredTickets.length === 0 && !loading && (
          <div className="p-24 text-center">
            <Icons.MailCheck className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Aucun ticket dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* 🔹 MODALE : CHAT & RÉSOLUTION DU TICKET */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0f172a] rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
              
              {/* Header Modal */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tighter text-white">{selectedTicket.subject || selectedTicket.sujet}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Par : {selectedTicket.user_email || selectedTicket.userEmail}</p>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"><Icons.X size={20} /></button>
              </div>

              {/* Zone de Chat (Messages) */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4 custom-scrollbar bg-[#020617] min-h-[300px] max-h-[500px]">
                {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                  selectedTicket.messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === "admin" ? "bg-red-600 text-white rounded-br-none shadow-lg shadow-red-600/20" : "bg-slate-800 text-slate-300 rounded-bl-none border border-white/5"}`}>
                        <p className="text-xs font-bold leading-relaxed">{msg.text}</p>
                        <div className={`flex justify-between items-center mt-2 opacity-60 ${msg.sender === "admin" ? "flex-row-reverse" : "flex-row"}`}>
                           <p className="text-[8px] font-black uppercase tracking-widest">
                             {msg.sender === "admin" ? "Support Rynek" : "Client"}
                           </p>
                           {msg.created_at && (
                             <p className="text-[8px] font-bold">
                               {new Date(msg.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                             </p>
                           )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 font-bold text-xs uppercase tracking-widest">
                    Aucun message dans ce ticket
                  </div>
                )}
              </div>

              {/* Zone d'action & Réponse */}
              <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                {selectedTicket.status !== "Résolu" ? (
                  <form onSubmit={handleReply} className="space-y-4">
                    <textarea 
                      value={replyText} onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Écrivez votre réponse au client..." 
                      className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 text-xs font-bold text-white focus:border-red-500 outline-none resize-none h-24 custom-scrollbar transition-colors"
                    />
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <button 
                        type="button" 
                        onClick={() => updateTicketStatus(selectedTicket.id, "Résolu")}
                        className="w-full sm:w-auto px-6 py-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <Icons.CheckCircle2 size={16} /> Marquer comme Résolu
                      </button>
                      <button 
                        type="submit" disabled={isReplying || !replyText.trim()}
                        className="w-full sm:w-auto flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex justify-center items-center gap-2 shadow-lg shadow-red-600/20 disabled:shadow-none"
                      >
                        {isReplying ? <Icons.Loader2 className="animate-spin" size={16} /> : <><Icons.Send size={16} /> Envoyer la réponse</>}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-emerald-500 font-black uppercase text-xs tracking-widest mb-2 flex items-center justify-center gap-2"><Icons.ShieldCheck size={18} /> Dossier Clôturé</p>
                    <button onClick={() => updateTicketStatus(selectedTicket.id, "Ouvert")} className="text-slate-500 hover:text-white text-[10px] font-bold uppercase underline transition-colors">Réouvrir le ticket</button>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}