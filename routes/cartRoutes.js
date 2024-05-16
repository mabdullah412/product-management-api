const express = require('express');

const authController = require('../controller/authController');
const cartController = require('../controller/cartController');
const router = express.Router();

router
.get('/', authController.validateTokenStatus, cartController.getCartItems);

router
.post('/add', authController.validateTokenStatus, cartController.addToCart);

router
.post('/remove', authController.validateTokenStatus, cartController.removeFromCart);

router
.post('/placeOrder', authController.validateTokenStatus);

module.exports = router;