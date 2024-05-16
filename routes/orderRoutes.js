const express = require("express");

const authController = require("../controller/authController");
const orderController = require("../controller/orderController");
const router = express.Router();

router.get("/", authController.validateTokenStatus, orderController.getOrderData);
router.post("/place", authController.validateTokenStatus, orderController.placeOrder);

module.exports = router;
