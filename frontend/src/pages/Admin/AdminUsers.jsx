import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabaseClient"; // 🔄 Import Supabase

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Tous");
  const [loading, setLoading] = useState(true);
  
  // États pour la gestion du solde
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");

  useEffect(() => {
    // 🚀 1. Fonction pour récupérer les utilisateurs
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setUsers(data);
      } catch (error) {
        console.error("Erreur chargement utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // ⚡ 2. Temps Réel Supabase (remplace onSnapshot)
    const channel = supabase.channel('admin-users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ⚙️ ACTIONS SUPABASE
  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Cette action est irréversible. Supprimer l'utilisateur ?")) {
      try { 
        await supabase.from('users').delete().eq('id', id); 
      } 
      catch (error) { console.error(error); }
    }
  };

  const toggleBan = async (id, currentBanStatus) => {
    try { 
      // On inverse le statut de is_banned
      await supabase.from('users').update({ is_banned: !currentBanStatus }).eq('id', id); 
    } 
    catch (error) { console.error(error); }
  };

  const handleUpdateBalance = async (e) => {
    e.preventDefault();
    if (!adjustAmount || isNaN(adjustAmount)) return;
    
    try {
      // Calcul du nouveau solde (Supabase n'a pas de 'increment' natif côté client sans RPC)
      const currentBalance = selectedUser.balance || 0;
      const newBalance = currentBalance + Number(adjustAmount);

      await supabase.from('users').update({ balance: newBalance }).eq('id', selectedUser.id);
      
      setIsEditModalOpen(false);
      setAdjustAmount("");
      alert("✅ Portefeuille mis à jour !");
    } catch (error) { 
      console.error(error); 
    }
  };

  // 🔍 Filtrage
  const filteredUsers = users.filter(u => {
    // Note : Supabase utilise 'full_name' selon ta base de données
    const matchesSearch = u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const userRole = u.role || "user";
    const matchesRole = filterRole === "Tous" || userRole === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.Loader2 className="animate-spin text-red-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* 🔹 STATS RAPIDES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Membres", val: users.length, icon: <Icons.Users />, col: "text-blue-500" },
          { label: "Administrateurs", val: users.filter(u => u.role === "admin" || u.is_admin).length, icon: <Icons.ShieldCheck />, col: "text-red-500" },
          { label: "Bannis", val: users.filter(u => u.is_banned).length, icon: <Icons.UserX />, col: "text-orange-500" },
          { label: "Trésorerie Totale", val: `${users.reduce((acc, u) => acc + (u.balance || 0), 0).toLocaleString()} F`, icon: <Icons.Wallet />, col: "text-emerald-500" },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f172a] p-6 rounded-[2rem] border border-white/5 shadow-xl flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-white/5 ${s.col}`}>{s.icon}</div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-xl font-black text-white">{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 FILTRES */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic self-start">
          Annuaire <span className="text-red-500">Membres</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-white focus:border-red-500 outline-none"
            />
          </div>
          <select 
            value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
            className="bg-[#0f172a] border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl outline-none"
          >
            <option value="Tous">Tous les Rôles</option>
            <option value="admin">Admins</option>
            <option value="vendeur">Vendeurs</option>
            <option value="client">Clients</option>
            <option value="user">Utilisateurs</option>
          </select>
        </div>
      </div>

      {/* 🔹 TABLEAU */}
      <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Profil</th>
                <th className="p-8">Finance</th>
                <th className="p-8">Rang</th>
                <th className="p-8">Rôle</th>
                <th className="p-8 text-right">Contrôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredUsers.map((u, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    key={u.id} className={`group ${u.is_banned ? 'bg-red-500/5' : 'hover:bg-white/[0.02]'} transition-colors`}
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center font-black text-white shadow-lg overflow-hidden">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            u.full_name?.charAt(0) || "U"
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-white text-xs uppercase tracking-tight">{u.full_name || "Sans Nom"}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <button 
                        onClick={() => { setSelectedUser(u); setIsEditModalOpen(true); }}
                        className="flex flex-col text-left group/btn"
                      >
                        <span className="text-emerald-400 font-black text-sm group-hover/btn:underline">{(u.balance || 0).toLocaleString()} F</span>
                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-1">
                          Éditer <Icons.Edit3 size={8} />
                        </span>
                      </button>
                    </td>
                    <td className="p-8">
                      <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-700 text-slate-400 bg-slate-800/50">
                        {u.level || "Standard"}
                      </span>
                    </td>
                    <td className="p-8 text-xs font-black uppercase tracking-tighter text-slate-500">
                      {u.role || "user"}
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toggleBan(u.id, u.is_banned)}
                          className={`p-3 rounded-xl transition-all ${u.is_banned ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white'}`}
                          title={u.is_banned ? "Débannir" : "Bannir"}
                        >
                          {u.is_banned ? <Icons.UserCheck size={16}/> : <Icons.UserX size={16} />}
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="p-3 bg-red-500/20 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                          title="Supprimer définitivement"
                        >
                          <Icons.Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 MODALE ÉDITION SOLDE */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0f172a] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl">
              <h3 className="text-white font-black uppercase text-sm mb-2">Ajuster le solde</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6">Utilisateur : {selectedUser?.full_name || selectedUser?.email}</p>
              
              <form onSubmit={handleUpdateBalance} className="space-y-4">
                <input 
                  type="number" placeholder="Ex: 5000 ou -2000" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-bold outline-none focus:border-emerald-500 transition-all"
                />
                <div className="flex gap-2">
                   <button type="submit" className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-colors">Confirmer</button>
                   <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 bg-white/5 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-colors">Annuler</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}