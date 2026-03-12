const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 📋 RÉCUPÉRER TOUS LES PRODUITS
router.get('/', productController.getAllProducts);

// 🔍 RÉCUPÉRER UN SEUL PRODUIT
router.get('/:id', productController.getOneProduct);

// 📝 CRÉER UN PRODUIT
router.post('/', productController.createProduct);

// 🔴 L'ERREUR ÉTAIT ICI : Assure-toi d'exporter uniquement 'router'
module.exports = router;