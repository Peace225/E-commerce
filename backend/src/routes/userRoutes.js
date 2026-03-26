const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 🔐 On utilise 'protect' comme dans tes autres fichiers
const { protect } = require('../middlewares/authMiddleware'); 

/**
 * 🔄 SYNCHRONISATION / LOGIN
 * URL: POST http://localhost:5000/api/auth/sync
 */
router.post('/sync', protect, authController.registerOrLogin); 

// 💡 Si tu avais une ligne avec 'orderController' ici, 
// supprime-la ! Les commandes doivent rester dans orderRoutes.js.

module.exports = router;