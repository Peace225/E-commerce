import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

// Composants
import EncartsDroite from "../components/EncartsDroite";
import CategorySidebar from "../components/CategorySidebar";
import BottomCatalogueSection from "../components/BottomCatalogueSection";
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
import FooterQwikfy from "../components/FooterQwikfy";
import AssistantChatbot from "../components/AssistantChatbot";
import PopupMarketing from "../components/PopupMarketing";
import PopupGestionMulticanal from "../components/PopupGestionMulticanal";
import DecompteAnime from "../components/DecompteAnime";

// Contexte et Data
import { CategorieContext } from "../contexte/CategoriesContext";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import bannerItems from "../data/banners.json";

export default function Accueil() {
  const [boutiques, setBoutiques] = useState([]);
  const { categorieActive, setCategorieActive } = useContext(CategorieContext);
  
  // 🔔 Gestion des Popups
  const [showPopupMarketing, setShowPopupMarketing] = useState(false);
  const [showPopupMultiCanal, setShowPopupMultiCanal] = useState(false);
  
  const navigate = useNavigate();

  // États pour le carrousel dynamique
  const [bannieres, setBannieres] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  const categories = [
    "Toutes", "Téléphones", "TV & HIGH TECH", "Informatique",
    "Maison, cuisine & bureau", "Électroménager", "Vêtements & Chaussures",
    "Beauté & Santé", "Jeux vidéos & Consoles", "Bricolage",
    "Sports & Loisirs", "Bébé & Jouets", "Librairie", "Autres catégories",
  ];

  // 🔄 FETCH BOUTIQUES
  useEffect(() => {
    const fetchBoutiques = async () => {
      try {
        const snapshot = await getDocs(collection(db, "boutiques"));
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBoutiques(list);
      } catch (error) {
        console.error("Erreur chargement boutiques:", error);
      }
    };
    fetchBoutiques();
  }, []);

  // 🔄 FETCH BANNIÈRES MARKETING (Firestore Sync)
  useEffect(() => {
    const q = query(
      collection(db, "marketing_banners"),
      where("actif", "==", true),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, 
      (snap) => {
        const bns = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setBannieres(bns);
        setLoadingBanners(false);
      },
      (error) => {
        console.error("🔥 Erreur Firebase (Bannières) :", error.message);
        setLoadingBanners(false); 
      }
    );

    return () => unsub();
  }, []);

  // ⏱️ TIMERS POUR LES POPUPS (Séquentiel pour éviter la surcharge)
  useEffect(() => {
    // Popup Marketing après 8 secondes
    const timer1 = setTimeout(() => setShowPopupMarketing(true), 8000);
    
    // Popup Multi-Canal après 15 secondes
    const timer2 = setTimeout(() => setShowPopupMultiCanal(true), 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // 💡 Fallback Banners
  const fallbackBanners = bannerItems.map((b, index) => ({
    id: `fallback-${index}`,
    titre: b.title,
    sousTitre: b.subtitle,
    imageUrl: b.image,
    lien: null
  }));

  const bannersToDisplay = bannieres.length > 0 ? bannieres : fallbackBanners;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Helmet>
        <title>Rynek - Découvrez les boutiques en ligne</title>
        <meta name="description" content="Explorez les meilleures boutiques en ligne par catégorie sur Rynek." />
        <link rel="canonical" href="https://www.qwikfly.com" />
      </Helmet>

      <div className="max-w-[1600px] mx-auto py-6 px-4 flex flex-col lg:flex-row gap-5">
        
        {/* ASIDE GAUCHE */}
        <aside className="hidden lg:block w-[215px] shrink-0">
          <div className="sticky top-24 bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <CategorySidebar
              categories={categories}
              categorieActive={categorieActive}
              onSelect={setCategorieActive}
            />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 flex flex-col gap-12 pb-20">
          
          <div className="relative overflow-hidden shadow-2xl border border-gray-100 bg-slate-900 group rounded-[2.5rem] min-h-[520px]">
            {loadingBanners ? (
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Carousel
                responsive={{ desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 }, tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 }, mobile: { breakpoint: { max: 464, min: 0 }, items: 1 } }}
                infinite autoPlay arrows={false} showDots autoPlaySpeed={5000} transitionDuration={800}
              >
                {bannersToDisplay.map((item) => (
                  <motion.section key={item.id} className="relative min-h-[520px] flex flex-col md:flex-row items-center justify-between px-10 py-12 md:px-20 overflow-hidden" style={{ background: `linear-gradient(135deg, #e96711 0%, #c55309 100%)` }}>
                    <div className="absolute inset-0 opacity-5 pointer-events-none border-[40px] border-white/10" />
                    
                    <div className="relative z-10 flex-1 text-white space-y-4">
                      <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-yellow-400 font-black text-sm uppercase tracking-[0.3em] mb-2">Exclusivité Rynek</p>
                        <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter uppercase italic">{item.titre}</h2>
                        <div className="h-1.5 w-24 bg-white mt-4 mb-6" />
                        <p className="text-lg md:text-xl font-light opacity-90 max-w-lg leading-relaxed border-l-2 border-white/30 pl-4">{item.sousTitre}</p>
                      </motion.div>
                      
                      <button 
                        onClick={() => item.lien ? window.location.href = item.lien : null}
                        className="group mt-8 flex items-center gap-3 bg-white text-[#e96711] px-10 py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-100 transition-all shadow-lg active:scale-95"
                      >
                        Découvrir l'offre
                        <div className="w-0 group-hover:w-6 transition-all duration-300 overflow-hidden">→</div>
                      </button>
                    </div>
                    
                    <div className="relative z-10 flex-1 flex justify-center items-center w-full mt-10 md:mt-0">
                      <img src={item.imageUrl} alt={item.titre} className="max-h-[400px] w-auto object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.3)]" />
                    </div>
                  </motion.section>
                ))}
              </Carousel>
            )}
          </div>

          <div className="flex flex-col gap-16 px-4 md:px-0">
            <TopDeals />
            <VentesFlash />
            <div className="bg-white border-y border-gray-100 py-12"><NosCategories /></div>
            <BoutiquesOfficielles />
            <AdidasBoutique />
            <ClimatisationVentilateurs />
            <Destockage />
            <InfinixBoutique />
            <Beaute />
            <Mode />
            <Tech />
            <MaisonElectromenager />
            <div className="mt-12"><AproposQwikfy /></div>
          </div>

          <AssistantChatbot />
          
          {/* 🔥 Popups synchronisés avec l'état local */}
          <PopupMarketing isOpen={showPopupMarketing} onClose={() => setShowPopupMarketing(false)} />
          <PopupGestionMulticanal isOpen={showPopupMultiCanal} onClose={() => setShowPopupMultiCanal(false)} />
        </main>

        <aside className="hidden lg:block w-[240px] shrink-0 mt-10">
          <div className="sticky top-32"><EncartsDroite /></div>
        </aside>
      </div>

      <FooterQwikfy />
    </div>
  );
}