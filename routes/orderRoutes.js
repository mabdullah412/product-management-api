const express = require("express");

const authController = require("../controller/authController");
const orderController = require("../controller/orderController");
const router = express.Router();

/**
 * @openapi
 * '/order':
 *  get:
 *    security:
 *      - BearerAuth: []
 *    tags:
 *    - Order Routes
 *    summary: Retrive order details by Id
 *    parameters:
 *      - in: query
 *        name: orderId
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      200:
 *        description: success
 *      400:
 *        description: Bad request
 */
router.get("/", authController.validateTokenStatus, orderController.getOrderData);

/**
 * @openapi
 * '/order/place':
 *  post:
 *    security:
 *      - BearerAuth: []
 *    tags:
 *    - Order Routes
 *    summary: Place order for items in cart
 *    responses:
 *      200:
 *        description: Successfully placed order
 *      400:
 *        description: Bad request
 *      404:
 *        description: No items found in cart
 */
router.post("/place", authController.validateTokenStatus, orderController.placeOrder);

module.exports = router;
