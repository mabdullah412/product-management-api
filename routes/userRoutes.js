const express = require('express');

const authController = require('../controller/authController');
const router = express.Router();

router.post('/', authController.signup);
// router.post('/validate', authController.validateTokenStatus);

module.exports = router;
