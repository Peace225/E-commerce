const express = require('express');
const router = express.Router(); // <--- Vérifie bien que cette ligne existe !
const orderController = require('../controllers/orderController');

// 🛒 CRÉATION (Acheteur)
// URL: POST http://localhost:5000/api/orders
router.post('/', orderController.createOrder);

// 📜 HISTORIQUE (Acheteur ou Vendeur)
// URL: GET http://localhost:5000/api/orders?uid=ID_USER&role=buyer
router.get('/', orderController.getUserOrders);

// 🔍 DÉTAIL D'UNE COMMANDE
// URL: GET http://localhost:5000/api/orders/:id
router.get('/:id', orderController.getOrderDetail);

// 📦 MISE À JOUR DU STATUT (Vendeur ou Admin)
// URL: PUT http://localhost:5000/api/orders/:id/status
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router; // <--- Maintenant 'router' est bien défini