const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 🔐 On utilise 'protect' (le douanier)
const { protect } = require('../middlewares/authMiddleware'); 

// 🔄 LA FAMEUSE ROUTE SYNC : C'est elle que React cherchait !
router.post('/sync', protect, authController.registerOrLogin); 

module.exports = router;