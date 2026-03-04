/**
 * 📦 RYNEK - Base de données centrale des produits
 * Ce fichier regroupe tous les articles du site par catégorie.
 */

// 🔹 1. CATÉGORIE : DÉSTOCKAGE
export const produitsDestockage = [
  {
    id: 101,
    name: "Washer Machine à laver 8kg",
    price: "1,790,000 FCFA",
    oldPrice: "2,735,000 FCFA",
    discount: "-34%",
    img: "/images/destockage/washer.jpg",
    commission: "5000 FCFA",
    description: "Haute performance avec technologie Inverter."
  },
  {
    id: 102,
    name: "Siera Machine à laver 9kg",
    price: "2,025,000 FCFA",
    oldPrice: "3,090,000 FCFA",
    discount: "-34%",
    img: "/images/destockage/siera.jpg",
    commission: "6500 FCFA",
    description: "Lavage ultra-silencieux et tambour inox."
  },
  {
    id: 103,
    name: "REVO Galaxy Récepteur",
    price: "62,000 FCFA",
    oldPrice: "95,000 FCFA",
    discount: "-34%",
    img: "/images/destockage/revo.jpg",
    commission: "1500 FCFA",
    description: "Récepteur satellite Full HD avec Wi-Fi."
  },
  {
    id: 104,
    name: "Daiko Congélateur vertical",
    price: "1,155,000 FCFA",
    oldPrice: "1,765,000 FCFA",
    discount: "-34%",
    img: "/images/destockage/congelateur.jpg",
    commission: "4500 FCFA",
    description: "Technologie No-Frost à tiroirs transparents."
  },
  {
    id: 105,
    name: "XIAOMI Redmi Watch 5",
    price: "215,000 FCFA",
    oldPrice: "325,000 FCFA",
    discount: "-34%",
    img: "/images/destockage/redmiwatch.jpg",
    commission: "2500 FCFA",
    description: "Écran AMOLED et suivi GPS intégré."
  },
  {
    id: 106,
    name: "Daiko Presse-agrumes",
    price: "69,000 FCFA",
    oldPrice: "105,000 FCFA",
    discount: "-34%",
    img: "/images/destockage/presse.jpg",
    commission: "1000 FCFA",
    description: "Puissant avec cônes interchangeables."
  },
];

// 🔹 2. CATÉGORIE : BEAUTÉ
export const produitsBeaute = [
  { 
    id: 201, 
    name: "NIVEA Gommage aux éclats de riz x2", 
    price: "83,000 FCFA", 
    oldPrice: "109,500 FCFA", 
    discount: "-24%", 
    img: "/images/beaute/gommage.jpg", 
    commission: "800 FCFA" 
  },
  { 
    id: 202, 
    name: "NIVEA Gel Nettoyant Purifiant x2", 
    price: "64,000 FCFA", 
    oldPrice: "109,500 FCFA", 
    discount: "-41%", 
    img: "/images/beaute/gel.jpg", 
    commission: "750 FCFA" 
  },
  { 
    id: 203, 
    name: "NIVEA Démaquillant yeux x2", 
    price: "68,000 FCFA", 
    oldPrice: "95,000 FCFA", 
    discount: "-29%", 
    img: "/images/beaute/demaquillant.jpg", 
    commission: "700 FCFA" 
  },
  { 
    id: 204, 
    name: "REVOLUTION BEAUTY Miracle Cream", 
    price: "38,500 FCFA", 
    oldPrice: "88,500 FCFA", 
    discount: "-56%", 
    img: "/images/beaute/miracle.jpg", 
    commission: "1200 FCFA" 
  },
];

// 🔹 3. CATÉGORIE : ADIDAS
export const produitsAdidas = [
  {
    id: 301,
    name: "Adidas Claquette Eezay",
    price: "78,000 FCFA",
    oldPrice: "196,500 FCFA",
    commission: "1000 FCFA",
    discount: "-60%",
    img: "/images/adidas/claquette.jpg"
  },
  {
    id: 302,
    name: "Adidas Chaussure Litecourt",
    price: "324,500 FCFA",
    oldPrice: "531,000 FCFA",
    commission: "1000 FCFA",
    discount: "-39%",
    img: "/images/adidas/Litecourt.jpg"
  },
  {
    id: 303,
    name: "Adidas Chaussure Zero",
    price: "301,000 FCFA",
    oldPrice: "563,500 FCFA",
    commission: "1000 FCFA",
    discount: "-47%",
    img: "/images/adidas/zero.jpg"
  }
];

// 🔹 4. CATÉGORIE : CLIMATISATION
export const climatiseurs = [
  {
    id: 401,
    name: "Samsung Climatiseur Mural",
    price: 479900,
    oldPrice: 649900,
    commissionRate: 0.1,
    discount: "-26%",
    img: "/images/clim/samsung.jpg" 
  },
  {
    id: 402,
    name: "LG Climatiseur DUALCOOL",
    price: 499100,
    oldPrice: 675000,
    commissionRate: 0.15,
    discount: "-26%",
    img: "/images/clim/lg.jpg"
  }
];

// CATEGORIES:Mode
export const produitsMode = [
  { id: 501, name: "Adidas Chaussure Litecourt", price: "345,000 FCFA", oldPrice: "565,000 FCFA", discount: "-39%", img: "/images/mode/litecourt.jpg", commission: "2500 FCFA" },
  { id: 502, name: "Koton Chemise Blanc Popeline", price: "163,500 FCFA", oldPrice: "215,000 FCFA", discount: "-24%", img: "/images/mode/chemisier.jpg", commission: "1200 FCFA" },
  { id: 503, name: "Defacto Chemisiers à manches", price: "110,000 FCFA", oldPrice: "", discount: "", img: "/images/mode/pantalon.jpg", commission: "800 FCFA" },
  { id: 504, name: "UGG Cozetta Curly Black", price: "458,500 FCFA", oldPrice: "1,148,000 FCFA", discount: "-60%", img: "/images/mode/2.jpg", commission: "5000 FCFA" },
  { id: 505, name: "Koton Pantalon Noir Femme", price: "209,500 FCFA", oldPrice: "295,000 FCFA", discount: "-29%", img: "/images/mode/jupe.jpg", commission: "1500 FCFA" },
  { id: 506, name: "Defacto Jupe mi-longue", price: "143,500 FCFA", oldPrice: "295,000 FCFA", discount: "-51%", img: "/images/mode/ugg.jpg", commission: "1000 FCFA" },
];
// CATEGORIES: MAISON
export const produitsMaison = [
  { id: 601, name: "Kitea Set MANHATTAN – 4 places", price: "1,705,000 FCFA", oldPrice: "2,755,000 FCFA", discount: "-38%", img: "/images/maison/kitea-set.jpg", commission: "15000 FCFA" },
  { id: 602, name: "Kenz Bouilloire Electrique", price: "58,500 FCFA", oldPrice: "130,500 FCFA", discount: "-55%", img: "/images/maison/bouilloire.jpg", commission: "1000 FCFA" },
  { id: 603, name: "Kitea Chaise FRESH - Gris", price: "235,500 FCFA", oldPrice: "327,500 FCFA", discount: "-28%", img: "/images/maison/chaise.jpg", commission: "2500 FCFA" },
  { id: 604, name: "XIAOMI Aspirateur Mi Vacuum", price: "1,574,000 FCFA", oldPrice: "1,967,500 FCFA", discount: "-20%", img: "/images/maison/aspirateur.jpg", commission: "8500 FCFA" },
  { id: 605, name: "Dansmamaison.ma LAA Sofa Set", price: "3,726,500 FCFA", oldPrice: "6,560,000 FCFA", discount: "-43%", img: "/images/maison/sofa.jpg", commission: "25000 FCFA" },
  { id: 606, name: "Kenz Hachoir électrique 3L", price: "124,000 FCFA", oldPrice: "262,000 FCFA", discount: "-53%", img: "/images/maison/hachoir.jpg", commission: "1500 FCFA" },
];
// CATEGORIES: TECH
export const produitsTech = [
  { id: 701, name: "SG SETUP GAMER R3 32G DDR4", price: "3,445,500 FCFA", oldPrice: "4,305,000 FCFA", discount: "-20%", img: "/images/tech/setup.jpg", commission: "50,000 FCFA" },
  { id: 702, name: "XIAOMI Redmi Buds 6 Plus", price: "71,500 FCFA", oldPrice: "114,000 FCFA", discount: "-37%", img: "/images/tech/buds.jpg", commission: "2000 FCFA" },
  { id: 703, name: "XIAOMI WiFi Range Extender", price: "62,500 FCFA", oldPrice: "78,000 FCFA", discount: "-20%", img: "/images/tech/range-extender.jpg", commission: "1500 FCFA" },
  { id: 704, name: "Echolink 32 Smart TV Frame", price: "755,000 FCFA", oldPrice: "987,500 FCFA", discount: "-24%", img: "/images/tech/echolink-tv.jpg", commission: "10,000 FCFA" },
  { id: 705, name: "XIAOMI Redmi Note 14", price: "1,311,500 FCFA", oldPrice: "2,098,000 FCFA", discount: "-37%", img: "/images/tech/redmi-note14.jpg", commission: "15,000 FCFA" },
  { id: 706, name: "Samsung Adaptateur secteur", price: "84,500 FCFA", oldPrice: "141,000 FCFA", discount: "-40%", img: "/images/tech/adaptateur.jpg", commission: "1000 FCFA" },
];