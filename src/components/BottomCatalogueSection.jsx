// src/components/BottomCatalogueSection.jsx
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const catalogueItems = [
  { label: "Spring",
    img: "/images/catalogue/spring.png" 
  },
  { label: "Journée spéciale", 
    img: "/images/catalogue/journee.png" 
  },
  { label: "Offres", 
    img: "/images/catalogue/offres.png" 
  },
  { label: "Nouveaux Clients",
    img: "/images/catalogue/nouveaux.png" 
  },
  { label: "Catalogue",
    img: "/images/catalogue/catalogue.png" 
  },
  { label: "Boutiques Officielles", 
    img: "/images/catalogue/boutiques.png" 
  },
  { label: "Livraison Offerte", 
    img: "/images/catalogue/livraison.png" 
  },
  { label: "Ventes Flash", 
    img: "/frontent/public/images/catalogues /Vente-Flash-min.png" 
  },
];

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 4 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 3 },
};

export default function BottomCatalogueSection() {
  return (
    <section className="bg-[#e96711] py-4">
      <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={2500}>
        {catalogueItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center px-2">
            <img src={item.img} alt={item.label} className="w-16 h-16 object-contain mb-2" />
            <p className="text-xs text-center">{item.label}</p>
          </div>
        ))}
      </Carousel>
    </section>
  );
}