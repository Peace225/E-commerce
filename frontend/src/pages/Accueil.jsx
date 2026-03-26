import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

// --- IMPORTS SUPABASE & THEME ---
import { supabase } from "../utils/supabaseClient"; 
import { useTheme } from "../contexte/ThemeProvider"; // 🎨 Pour les couleurs dynamiques

// Composants
import AffichageCategorie from "../components/AffichageCategorie";
import EncartsDroite from "../components/EncartsDroite";
import CategorySidebar from "../components/CategorySidebar";
import TopDeals from "../components/TopDeals";
import VentesFlash from "../components/VentesFlash";
import NosCategories from "../components/NosCategories";
import BoutiquesOfficielles from "../components/BoutiquesOfficielles";
import AdidasBoutique from "../components/AdidasBoutique";
import ClimatisationVentilateurs from "../components/ClimatisationVentioateurs";
import Destockage from "../components/Destockage";
import InfinixBoutique from "../components/InfinixBoutique";
import Beaute from "../components/Beaute";
import Mode from "../components/Mode";
import MaisonElectromenager from "../components/MaisonElectromenager";
import Tech from "../components/Tech";
import AproposQwikfy from "../components/AproposQwikfy";
import AssistantChatbot from "../components/AssistantChatbot";
import PopupMarketing from "../components/PopupMarketing";
import PopupGestionMulticanal from "../components/PopupGestionMulticanal";

// Contexte et Data
import { CategorieContext } from "../contexte/CategoriesContext";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import bannerItems from "../data/banners.json";

export default function Accueil() {
  const { currentTheme } = useTheme(); // 🎨 Récupération du thème (Pâques, Noël, etc.)
  const [boutiques, setBoutiques] = useState([]);
  const { categorieActive, setCategorieActive } = useContext(CategorieContext);
  
  const [showPopupMarketing, setShowPopupMarketing] = useState(false);
  const [showPopupMultiCanal, setShowPopupMultiCanal] = useState(false);
  
  const navigate = useNavigate();

  const [bannieres, setBannieres] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  const categories = [
    "Toutes", "Téléphones", "TV & HIGH TECH", "Informatique",
    "Maison, cuisine & bureau", "Électroménager", "Vêtements & Chaussures",
    "Beauté & Santé", "Jeux vidéos & Consoles", "Bricolage",
    "Sports & Loisirs", "Bébé & Jouets", "Librairie", "Autres catégories",
  ];

  // 🔄 FETCH BOUTIQUES (Supabase)
  useEffect(() => {
    const fetchBoutiques = async () => {
      try {
        const { data, error } = await supabase
          .from('boutiques')
          .select('*');
        if (error) throw error;
        setBoutiques(data || []);
      } catch (error) {
        console.error("Erreur chargement boutiques:", error.message);
      }
    };
    fetchBoutiques();
  }, []);

  // 🔄 FETCH BANNIÈRES MARKETING (Supabase)
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('marketing_banners')
          .select('*')
          .eq('actif', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBannieres(data || []);
      } catch (error) {
        console.error("🔥 Erreur Supabase (Bannières) :", error.message);
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchBanners();

    // Optionnel : Realtime pour les bannières
    const subscription = supabase
      .channel('banners-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketing_banners' }, fetchBanners)
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  // ⏱️ TIMERS POPUPS
  useEffect(() => {
    const timer1 = setTimeout(() => setShowPopupMarketing(true), 8000);
    const timer2 = setTimeout(() => setShowPopupMultiCanal(true), 15000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  const fallbackBanners = bannerItems.map((b, index) => ({
    id: `fallback-${index}`,
    titre: b.title,
    sousTitre: b.subtitle,
    imageUrl: b.image,
    lien: null
  }));

  const bannersToDisplay = bannieres.length > 0 ? bannieres : fallbackBanners;

  return (
    <div className="w-full font-['Inter',sans-serif] bg-primary">
      <Helmet>
        <title>Rynek - Découvrez les meilleures boutiques en ligne</title>
        <meta name="description" content="Explorez les meilleures boutiques en ligne sur Rynek." />
      </Helmet>

      <div className="max-w-[1600px] mx-auto py-4 lg:py-6 px-4 flex flex-col lg:flex-row gap-5">
        
        {/* ASIDE GAUCHE */}
        <aside className="hidden lg:block w-[215px] xl:w-[250px] shrink-0">
          <div className="sticky top-24   overflow-hidden border border-primary">
            <CategorySidebar
              categories={categories}
              categorieActive={categorieActive}
              onSelect={setCategorieActive}
            />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 flex flex-col gap-8 md:gap-12 pb-20">
          
          {/* Nav Mobile Dynamique */}
          <nav className="lg:hidden w-full overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2 w-max px-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategorieActive(cat)}
                  className={`snap-start px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                    categorieActive === cat
                      ? "bg-primary text-theme-text shadow-md scale-105" // 🎨 Couleur Thème
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </nav>

          {categorieActive === "Toutes" ? (
            <>
              {/* --- HERO BANNER SAISONNIER --- */}
              <section className="relative overflow-hidden shadow-2xl border border-primary bg-slate-900 group rounded-3xl md:rounded-[2.5rem] min-h-[400px] md:min-h-[520px]">
                {loadingBanners ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <Carousel
                    responsive={{ desktop: { items: 1, breakpoint: { max: 3000, min: 1024 } }, tablet: { items: 1, breakpoint: { max: 1024, min: 464 } }, mobile: { items: 1, breakpoint: { max: 464, min: 0 } } }}
                    infinite autoPlay arrows={false} showDots autoPlaySpeed={5000} transitionDuration={800}
                    className="h-full"
                  >
                    {bannersToDisplay.map((item) => (
                      <motion.div 
                        key={item.id} 
                        className="relative min-h-[400px] md:min-h-[520px] flex flex-col md:flex-row items-center justify-center md:justify-between px-6 py-10 md:px-20 overflow-hidden transition-colors duration-1000" 
                        style={{ background: `linear-gradient(135deg, ${currentTheme?.colors.primary} 0%, ${currentTheme?.colors.secondary} 100%)` }} // 🎨 Dégradé Thème
                      >
                        <div className="absolute inset-0 opacity-5 pointer-events-none border-[20px] md:border-[40px] border-white/10" />
                        
                        <div className="relative z-10 flex-1 text-white space-y-4 text-center md:text-left">
                          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}>
                            <p className="text-white/80 font-black text-[10px] md:text-sm uppercase tracking-[0.3em] mb-2">{currentTheme?.name}</p>
                            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tighter uppercase italic">
                              {item.titre}
                            </h2>
                            <p className="text-sm md:text-xl font-light opacity-90 max-w-lg mt-4 mx-auto md:mx-0">
                              {item.sousTitre}
                            </p>
                          </motion.div>
                          
                          <button 
                            onClick={() => item.lien ? window.location.href = item.lien : null}
                            className="bg-white text-primary px-8 py-3 md:px-10 md:py-4 font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-gray-100 transition-all shadow-lg active:scale-95 rounded-full mt-8"
                          >
                            Découvrir l'offre
                          </button>
                        </div>
                        
                        <div className="relative z-10 flex-1 flex justify-center items-center w-full mt-8 md:mt-0">
                          <img src={item.imageUrl} alt={item.titre} className="h-48 md:max-h-[400px] w-auto object-contain drop-shadow-2xl" />
                        </div>
                      </motion.div>
                    ))}
                  </Carousel>
                )}
              </section>

              <div className="flex flex-col gap-10 md:gap-16">
                <TopDeals />
                <VentesFlash />
                <div className="bg-white py-8 rounded-2xl shadow-sm"><NosCategories /></div>
                <BoutiquesOfficielles />
                {/* Les autres sections... */}
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

        {/* ASIDE DROITE */}
        <aside className="hidden lg:block w-[240px] xl:w-[280px] shrink-0">
          <div className="sticky top-24"><EncartsDroite /></div>
        </aside>
      </div>
    </div>
  );
}