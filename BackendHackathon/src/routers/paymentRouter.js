const express = require('express');
const router = express.Router();
const paymentcontroller = require('../controllers/paymentController');
router.post('/',paymentcontroller.payment);

module.exports = router;