const express = require('express');

const authController = require('../controller/authController');
const cartController = require('../controller/cartController');
const router = express.Router();

/**
 * @openapi
 * '/cart':
 *  get:
 *    security:
 *      - BearerAuth: []
 *    tags:
 *    - Cart Routes
 *    summary: Get products in cart
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 */
router
.get('/', authController.validateTokenStatus, cartController.getCartItems);

/**
 * @openapi
 * '/cart/add':
 *  post:
 *    security:
 *      - BearerAuth: []
 *    tags:
 *    - Cart Routes
 *    summary: Add item to cart
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - productId
 *              - quantity
 *            properties:
 *              productId:
 *                type: string
 *                default: 5
 *              quantity:
 *                type: string
 *                default: 1
 *    responses:
 *      200:
 *        description: Added to cart
 *      400:
 *        description: Bad request
 */
router
.post('/add', authController.validateTokenStatus, cartController.addToCart);

/**
 * @openapi
 * '/cart/remove':
 *  post:
 *    security:
 *      - BearerAuth: []
 *    tags:
 *    - Cart Routes
 *    summary: Remove item from cart
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - productId
 *            properties:
 *              productId:
 *                type: string
 *                default: 5
 *    responses:
 *      200:
 *        description: Removed successfully
 *      400:
 *        description: Bad request
 *      404:
 *        description: Product not found in cart
 */
router
.post('/remove', authController.validateTokenStatus, cartController.removeFromCart);

module.exports = router;