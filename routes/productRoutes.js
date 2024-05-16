const express = require('express');

const authController = require('../controller/authController');
const productController = require('../controller/productController');
const router = express.Router();

router
.get('/', productController.getAllProducts)
.post('/', authController.validateTokenStatus, productController.createProduct)
.patch('/', authController.validateTokenStatus, productController.updateProduct)
.delete('/', authController.validateTokenStatus, productController.deleteProduct);

module.exports = router;