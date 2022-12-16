const express = require('express');
const router = express.Router();
const verifyPaymentController = require('../controllers/verifyPaymentController');

router.post('/', verifyPaymentController.verifyPayment);

module.exports = router;