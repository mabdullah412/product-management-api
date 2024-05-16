const express = require('express');

const authController = require('../controller/authController');
const productController = require('../controller/productController');
const router = express.Router();

router
/**
 * @openapi
 * '/products':
 *  get:
 *    tags:
 *    - Product Routes
 *    security: []
 *    summary: Get all products
 *    responses:
 *      200:
 *        description: Created
 *      400:
 *        description: Bad request
 */
.get('/', productController.getAllProducts)
/**
 * @openapi
 * '/products':
 *  post:
 *    security:
 *      - BearerAuth: []
 *    tags:
 *    - Product Routes
 *    summary: Create a product
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - description
 *              - price
 *              - category
 *            properties:
 *              name:
 *                type: string
 *                default: watermelon
 *              description:
 *                type: string
 *                default: fresh watermelons for you
 *              price:
 *                type: float
 *                default: 99
 *              category:
 *                type: string
 *                default: fruit
 *    responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad request
 */
.post('/', authController.validateTokenStatus, productController.createProduct)
/**
 * @openapi
 * '/products':
 *  patch:
 *    security:
 *      - BearerAuth: []
 *    tags:
 *    - Product Routes
 *    summary: Update a product
 *    requestBody:
 *      required: false
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - productId
 *              - name
 *              - description
 *              - price
 *              - category
 *            properties:
 *              productId:
 *                type: string
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              price:
 *                type: float
 *              category:
 *                type: string
 *    responses:
 *      200:
 *        description: Updated
 *      404:
 *        description: Not found
 *      400:
 *        description: Bad request
 */
.patch('/', authController.validateTokenStatus, productController.updateProduct)
/**
 * @openapi
 * '/products':
 *  delete:
 *    security:
 *      - BearerAuth: []
 *    tags:
 *    - Product Routes
 *    summary: Delete a product
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
 *    responses:
 *      204:
 *        description: Deleted successfully
 *      404:
 *        description: Not found
 *      400:
 *        description: Bad request
 */
.delete('/', authController.validateTokenStatus, productController.deleteProduct);

module.exports = router;