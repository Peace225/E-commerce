import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import * as Icons from "lucide-react"; // Pour le Loader2

// --- IMPORTS SUPABASE & THEME ---
import { supabase } from "../utils/supabaseClient"; 
import { useTheme } from "../contexte/ThemeProvider"; 

// Composants
import AffichageCategorie from "../components/AffichageCategorie";
import EncartsDroite from "../components/EncartsDroite";
import CategorySidebar from "../components/CategorySidebar";
import TopDeals from "../components/TopDeals";
import VentesFlash from "../components/VentesFlash";
import NosCategories from "../components/NosCategories";
import BoutiquesOfficielles from "../components/BoutiquesOfficielles";
import AproposQwikfy from "../components/AproposQwikfy";
import AssistantChatbot from "../components/AssistantChatbot";
import PopupMarketing from "../components/PopupMarketing";
import PopupGestionMulticanal from "../components/PopupGestionMulticanal";

// Contexte et Data
import { CategorieContext } from "../contexte/CategoriesContext";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import bannerItems from "../data/banners.json";

// 🔹 CONFIGURATION RESPONSIVE POUR LE CAROUSEL (Fixe l'erreur 'max')
const responsiveBanner = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
};

export default function Accueil() {
  const { currentTheme } = useTheme(); 
  const [boutiques, setBoutiques] = useState([]);
  const { categorieActive, setCategorieActive } = useContext(CategorieContext);
  
  const [showPopupMarketing, setShowPopupMarketing] = useState(false);
  const [showPopupMultiCanal, setShowPopupMultiCanal] = useState(false);
  
  const [bannieres, setBannieres] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  const categories = [
    "Toutes", "Téléphones", "TV & HIGH TECH", "Informatique",
    "Maison, cuisine & bureau", "Électroménager", "Vêtements & Chaussures",
    "Beauté & Santé", "Jeux vidéos & Consoles", "Bricolage",
    "Sports & Loisirs", "Bébé & Jouets", "Librairie", "Autres catégories",
  ];

  // 🔄 FETCH DATA INITIALE
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingBanners(true);
        const [boutiquesRes, bannersRes] = await Promise.all([
          supabase.from('boutiques').select('*').eq('is_active', true),
          supabase.from('marketing_banners').select('*').eq('actif', true).order('created_at', { ascending: false })
        ]);

        if (boutiquesRes.data) setBoutiques(boutiquesRes.data);
        if (bannersRes.data) setBannieres(bannersRes.data);
      } catch (error) {
        console.error("Erreur chargement données:", error.message);
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchInitialData();

    // ⚡ REALTIME UPDATES
    const channel = supabase
      .channel('accueil-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketing_banners' }, () => fetchInitialData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ⏱️ TIMERS POPUPS
  useEffect(() => {
    const timer1 = setTimeout(() => setShowPopupMarketing(true), 8000);
    const timer2 = setTimeout(() => setShowPopupMultiCanal(true), 15000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  const bannersToDisplay = bannieres.length > 0 
    ? bannieres 
    : bannerItems.map((b, i) => ({ id: `f-${i}`, titre: b.title, sousTitre: b.subtitle, imageUrl: b.image }));

  return (
    <div className="w-full font-['Inter',sans-serif] bg-gray-50 min-h-screen">
      <Helmet>
        <title>Rynek | Boutique en ligne N°1</title>
        <meta name="description" content="Découvrez les meilleures offres sur Rynek." />
      </Helmet>

      <div className="max-w-[1600px] mx-auto py-4 lg:py-6 px-4 flex flex-col lg:flex-row gap-5">
        
        {/* ASIDE GAUCHE */}
        <aside className="hidden lg:block w-[215px] xl:w-[250px] shrink-0">
          <div className="sticky top-24 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <CategorySidebar
              categories={categories}
              categorieActive={categorieActive}
              onSelect={setCategorieActive}
            />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 flex flex-col gap-8 md:gap-12 pb-20">
          
          {/* Nav Mobile */}
          <nav className="lg:hidden w-full overflow-x-auto pb-4 scrollbar-hide snap-x">
            <div className="flex gap-2 w-max px-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategorieActive(cat)}
                  className={`snap-start px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    categorieActive === cat
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105"
                      : "bg-white text-gray-500 border border-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </nav>

          {categorieActive === "Toutes" ? (
            <>
              {/* HERO BANNER */}
              <section className="relative overflow-hidden shadow-2xl bg-[#0f172a] rounded-[2rem] md:rounded-[3.5rem] min-h-[400px] md:min-h-[520px]">
                {loadingBanners ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 gap-4">
                     <Icons.Loader2 className="animate-spin text-orange-500" size={40} />
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Initialisation du flux...</p>
                  </div>
                ) : (
                  <Carousel
                    responsive={responsiveBanner}
                    infinite={true}
                    autoPlay={true}
                    arrows={false}
                    showDots={true}
                    autoPlaySpeed={6000}
                    transitionDuration={1000}
                    className="h-full z-10"
                    dotListClass="custom-dot-list"
                  >
                    {bannersToDisplay.map((item) => (
                      <div 
                        key={item.id} 
                        className="relative min-h-[400px] md:min-h-[520px] flex flex-col md:flex-row items-center justify-between px-8 py-10 md:px-20 overflow-hidden" 
                        style={{ 
                          background: `linear-gradient(135deg, ${currentTheme?.colors?.primary || '#f97316'} 0%, ${currentTheme?.colors?.secondary || '#0f172a'} 100%)` 
                        }}
                      >
                        <div className="relative z-10 flex-1 text-white text-center md:text-left">
                          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                            <p className="text-white/60 font-black text-[10px] uppercase tracking-[0.4em] mb-4 italic">Premium Selection</p>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter uppercase italic">
                              {item.titre}
                            </h2>
                            <p className="text-sm md:text-lg font-medium opacity-80 max-w-lg mt-6 mx-auto md:mx-0">
                              {item.sousTitre}
                            </p>
                            <button 
                              onClick={() => item.lien && (window.location.href = item.lien)}
                              className="bg-white text-slate-950 px-10 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-orange-500 hover:text-white transition-all shadow-2xl rounded-2xl mt-10 active:scale-95"
                            >
                              Découvrir l'offre
                            </button>
                          </motion.div>
                        </div>
                        
                        <div className="relative z-10 flex-1 flex justify-center items-center w-full mt-10 md:mt-0">
                          <motion.img 
                            initial={{ scale: 0.5, opacity: 0, rotate: 10 }} 
                            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                            src={item.imageUrl} 
                            alt={item.titre} 
                            className="h-60 md:h-[480px] w-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)]" 
                          />
                        </div>

                        {/* Éléments de design abstraits */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
                      </div>
                    ))}
                  </Carousel>
                )}
              </section>

              <div className="flex flex-col gap-10 md:gap-24">
                <TopDeals />
                <VentesFlash />
                <div className="bg-white py-16 rounded-[3rem] shadow-sm border border-slate-50"><NosCategories /></div>
                <BoutiquesOfficielles />
                <AproposQwikfy />
              </div>
            </>
          ) : (
            <AffichageCategorie categorie={categorieActive} />
          )}

          <AssistantChatbot />
          <PopupMarketing isOpen={showPopupMarketing} onClose={() => setShowPopupMarketing(false)} />
          <PopupGestionMulticanal isOpen={showPopupMultiCanal} onClose={() => setShowPopupMultiCanal(false)} />
        </main>

        <aside className="hidden lg:block w-[240px] xl:w-[280px] shrink-0">
          <div className="sticky top-24"><EncartsDroite /></div>
        </aside>
      </div>
    </div>
  );
}