const express = require('express');
const router = express.Router(); // <--- CETTE LIGNE MANQUE OU EST MAL ÉCRITE
const orderController = require('../controllers/orderController');

// 🛒 CRÉATION
router.post('/', orderController.createOrder);

// 📜 HISTORIQUE
router.get('/', orderController.getUserOrders);

// 🔍 DÉTAIL
router.get('/:id', orderController.getOrderDetail);

// 📦 STATUT
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router; // <--- Maintenant 'router' est bien défini