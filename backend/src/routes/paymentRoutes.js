const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middlewares/authMiddleware'); // Optionnel mais conseillé

// Demander un retrait
router.post('/withdraw', verifyToken, paymentController.requestWithdrawal);

// Voir l'historique
router.get('/history/:uid', verifyToken, paymentController.getPaymentHistory);

module.exports = router;