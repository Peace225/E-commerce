const express = require('express');
const router = express.Router(); 

// 1. Importations
const orderController = require('../controllers/orderController');
const authMiddlewareFile = require('../middlewares/authMiddleware'); 

// 2. 🔍 CAPTEURS DE SÉCURITÉ (Pour voir le coupable dans le terminal)
console.log("🔍 Vérification des imports dans orderRoutes :");
console.log("👉 orderController.createOrder :", typeof orderController.createOrder);
console.log("👉 authMiddlewareFile (brut) :", typeof authMiddlewareFile);

// On essaie d'extraire 'protect', sinon on prend le middleware global si c'est un export par défaut
const protect = authMiddlewareFile.protect || authMiddlewareFile;
console.log("👉 protect (final) :", typeof protect);

// 🛒 CRÉATION (Acheteur)
router.post('/', protect, orderController.createOrder);

// 📜 HISTORIQUE (Acheteur ou Vendeur)
router.get('/', protect, orderController.getUserOrders);

// 🔍 DÉTAIL D'UNE COMMANDE
router.get('/:id', protect, orderController.getOrderDetail);

// 📦 MISE À JOUR DU STATUT
router.put('/:id/status', protect, orderController.updateOrderStatus);

module.exports = router;