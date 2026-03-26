const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// 🔐 On importe la fonction 'protect' (ou 'verifyToken' selon le nom que tu lui as donné)
const { protect } = require('../middlewares/authMiddleware'); 

// 💸 Demander un retrait
router.post('/withdraw', protect, paymentController.requestWithdrawal);

// 📈 Voir l'historique
router.get('/history/:uid', protect, paymentController.getPaymentHistory);

module.exports = router;