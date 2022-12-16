const express = require('express');
const router = express.Router();
const getPaymentController = require('../controllers/getPaymentController');

router.post('/',getPaymentController.getPayment);

module.exports = router;