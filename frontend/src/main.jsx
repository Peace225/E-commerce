import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 🎨 Styles Carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 🔐 Import de tes contextes (Vérifie bien les chemins !)
import { ThemeProvider } from './contexte/ThemeProvider' 
import { AuthProvider } from './contexte/AuthContext'
import { CartProvider } from './components/CartContext' // Ajuste si c'est ./contexte/

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 🌟 On enveloppe l'App dans les "bulles" de contexte */}
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)