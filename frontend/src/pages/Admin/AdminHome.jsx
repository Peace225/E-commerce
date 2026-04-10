import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../../utils/supabaseClient"; // 🔄 Import essentiel de Supabase

export default function AdminHome() {
  const [stats, setStats] = useState({
    users: 0,
    boutiques: 0,
    balance: 0,
    pendingWithdrawals: 0,
    totalSales: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // 🚀 FONCTION DE CHARGEMENT INITIAL
    const fetchStats = async () => {
      try {
        // 1. Stats Utilisateurs & Balance globale
        const { data: usersData, count: usersCount } = await supabase
          .from('users')
          .select('balance', { count: 'exact' });
        
        const totalBalance = usersData 
          ? usersData.reduce((acc, curr) => acc + (curr.balance || 0), 0) 
          : 0;

        // 2. Stats Boutiques
        const { count: boutiquesCount } = await supabase
          .from('boutiques')
          .select('*', { count: 'exact', head: true });

        // 3. Retraits en attente
        const { count: pendingCount } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'En attente')
          .eq('type', 'withdrawal'); // Précision utile si tu as plusieurs types de transactions

        setStats(prev => ({
          ...prev,
          users: usersCount || 0,
          balance: totalBalance,
          boutiques: boutiquesCount || 0,
          pendingWithdrawals: pendingCount || 0
        }));

        // 4. Flux d'activités récentes (les 5 dernières transactions)
        const { data: recentData } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false }) // Attention: Supabase utilise souvent created_at au lieu de createdAt
          .limit(5);

        if (recentData) setRecentActivities(recentData);

      } catch (error) {
        console.error("Erreur lors du chargement des statistiques globales:", error);
      }
    };

    fetchStats();

    // ⚡ SOUSCRIPTIONS TEMPS RÉEL (Le nouveau 'onSnapshot')
    const channels = supabase.channel('admin-dashboard-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchStats(); // Recharge si un user est ajouté ou si une balance change
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'boutiques' }, () => {
        fetchStats(); 
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchStats(); 
      })
      .subscribe();

    // Nettoyage à la destruction du composant
    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

  const cards = [
    { 
      title: "Utilisateurs", 
      value: stats.users, 
      desc: "Comptes enregistrés", 
      icon: <Icons.Users size={24} />, 
      color: "text-emerald-500 bg-emerald-500/10",
      border: "border-emerald-500/20" 
    },
    { 
      title: "Boutiques", 
      value: stats.boutiques, 
      desc: "Partenaires actifs", 
      icon: <Icons.Store size={24} />, 
      color: "text-blue-500 bg-blue-500/10",
      border: "border-blue-500/20" 
    },
    { 
      title: "Trésorerie", 
      value: `${stats.balance.toLocaleString()} F`, 
      desc: "Solde total des wallets", 
      icon: <Icons.Wallet size={24} />, 
      color: "text-purple-500 bg-purple-500/10",
      border: "border-purple-500/20" 
    },
    { 
      title: "Alertes Retraits", 
      value: stats.pendingWithdrawals, 
      desc: "Demandes prioritaires", 
      icon: <Icons.Clock size={24} />, 
      color: "text-orange-500 bg-orange-500/10",
      border: "border-orange-500/20" 
    },
  ];

  return (
    <div className="space-y-10">
      {/* 🔹 HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
            Monitor <span className="text-red-600">Global</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Système d'exploitation Rynek Pro v3.0
          </p>
        </div>
        <div className="hidden md:block bg-[#0f172a] px-6 py-3 rounded-2xl border border-white/5">
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Temps réel</p>
          <p className="text-white font-mono text-xs">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* 🔹 GRILLE DE STATS (4 colonnes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} 
            className={`bg-[#0f172a] p-8 rounded-[2.5rem] border ${card.border} shadow-2xl relative overflow-hidden group`}
          >
            <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center mb-6`}>
              {card.icon}
            </div>
            <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{card.title}</h2>
            <p className="text-3xl font-black text-white mb-1 tracking-tighter">{card.value}</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase italic">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 🔹 SECTION ACTIVITÉS RÉCENTES (2/3) */}
        <div className="xl:col-span-2 bg-[#0f172a] rounded-[3rem] p-10 border border-white/5 shadow-2xl">
          <h3 className="text-white font-black uppercase text-xs tracking-widest mb-8 flex items-center gap-3">
            <Icons.Zap size={16} className="text-red-600" /> Flux de transactions
          </h3>
          
          <div className="space-y-6">
            {recentActivities.length > 0 ? recentActivities.map((act, i) => (
              <div key={act.id || i} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5 group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${act.type === 'withdrawal' ? 'text-orange-500' : 'text-emerald-500'}`}>
                    {act.type === 'withdrawal' ? <Icons.ArrowUpRight size={18}/> : <Icons.ArrowDownLeft size={18}/>}
                  </div>
                  <div>
                    <p className="text-white font-black text-xs uppercase tracking-tight">{act.title || "Transaction"}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{act.method || "Système"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${act.type === 'withdrawal' ? 'text-orange-500' : 'text-emerald-500'}`}>
                    {act.type === 'withdrawal' ? '-' : '+'}{act.amount?.toLocaleString()} F
                  </p>
                  <p className="text-[9px] text-slate-600 font-mono uppercase italic">
                    {act.status}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-600 font-bold text-xs py-10">Aucune activité récente.</p>
            )}
          </div>
        </div>

        {/* 🔹 ACTIONS RAPIDES (1/3) */}
        <div className="space-y-6">
          <div className="bg-red-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-red-600/20 group">
            <Icons.ShieldAlert size={120} className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4">Urgence Sécurité</h3>
            <p className="text-sm font-bold leading-relaxed mb-6 opacity-80">En cas de faille, activez le mode maintenance global immédiatement.</p>
            <button className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-95 transition-all">
              Maintenance ON
            </button>
          </div>

          <div className="bg-[#0f172a] rounded-[3rem] p-10 border border-white/5 shadow-2xl">
            <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-3">
              Raccourcis
            </h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { icon: <Icons.UserPlus />, label: "Nouveau Admin", color: "text-red-500" },
                 { icon: <Icons.PlusCircle />, label: "Ajout Produit", color: "text-blue-500" },
                 { icon: <Icons.Download />, label: "Export CSV", color: "text-emerald-500" },
                 { icon: <Icons.HelpCircle />, label: "Tickets", color: "text-purple-500" },
               ].map((btn, i) => (
                 <button key={i} className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 hover:bg-white/10 rounded-3xl transition-all border border-white/5">
                    <span className={btn.color}>{btn.icon}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{btn.label}</span>
                 </button>
               ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}