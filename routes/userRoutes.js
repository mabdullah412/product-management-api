const express = require('express');

const authController = require('../controller/authController');
const router = express.Router();

router.post('/', authController.signup);

module.exports = router;
