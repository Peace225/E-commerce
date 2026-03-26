const express = require('express');
const router = express.Router(); 
const orderController = require('../controllers/orderController');

// ✅ ON CHANGE CETTE LIGNE : On pointe vers le bon fichier et on extrait la fonction 'protect'
const { protect } = require('../middlewares/authMiddleware'); 

// 🛒 CRÉATION (Acheteur) - On ajoute 'protect' pour sécuriser la route
router.post('/', protect, orderController.createOrder);

// 📜 HISTORIQUE (Acheteur ou Vendeur)
router.get('/', protect, orderController.getUserOrders);

// 🔍 DÉTAIL D'UNE COMMANDE
router.get('/:id', protect, orderController.getOrderDetail);

// 📦 MISE À JOUR DU STATUT
router.put('/:id/status', protect, orderController.updateOrderStatus);

module.exports = router;