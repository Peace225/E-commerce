const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

// 🟢 RÉCUPÉRER LE PROFIL (Public)
// URL: GET http://localhost:5000/api/users/:uid
router.get('/:uid', userController.getUserProfile);

// 🔴 DEMANDER UN RETRAIT (Privé - nécessite d'être connecté)
// URL: POST http://localhost:5000/api/users/withdraw
router.post('/withdraw', verifyToken, userController.requestWithdrawal);

module.exports = router;