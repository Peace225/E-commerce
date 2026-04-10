import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 L'élément manquant est ici !
import './index.css'
import App from './App.jsx'

// 🎨 Styles Carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 🔐 Import de tes contextes
import { ThemeProvider } from './contexte/ThemeProvider' 
import { AuthProvider } from './contexte/AuthContext'
import { CartProvider } from './components/CartContext'
import { CategorieProvider } from "./contexte/CategoriesContext"; // Ajouté pour être complet

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 🌐 On place le Router TOUT en haut pour activer useLocation() partout */}
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <CategorieProvider>
              <App />
            </CategorieProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)