export default function ThemeBoutique() {
  const themes = [
    { id: "dark", name: "Midnight Onyx", preview: "bg-[#0f172a]", accent: "border-orange-500" },
    { id: "light", name: "Clean Minimal", preview: "bg-gray-50", accent: "border-blue-500" },
    { id: "luxury", name: "Royal Gold", preview: "bg-slate-900", accent: "border-yellow-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {themes.map((t) => (
          <div key={t.id} className="bg-white/5 border border-white/10 rounded-[3rem] p-8 group hover:border-white/20 transition-all">
            <div className={`w-full h-40 ${t.preview} rounded-2xl mb-6 border-4 ${t.accent} shadow-2xl relative overflow-hidden`}>
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>
            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-4">{t.name}</h4>
            <button className="w-full py-4 bg-white/5 hover:bg-white text-slate-400 hover:text-black rounded-xl font-black uppercase text-[9px] tracking-[0.2em] transition-all">
              Appliquer le thème
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}