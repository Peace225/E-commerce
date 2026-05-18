const express = require('express');
const router = express.Router();

// ✅ CORRECTION : On utilise les accolades pour extraire directement la fonction
const { registerOrLogin } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); 

// 🔄 LA FAMEUSE ROUTE SYNC
router.post('/sync', protect, registerOrLogin); 

module.exports = router;