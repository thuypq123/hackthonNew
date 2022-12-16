const express = require('express');
const router = express.Router();
const paymentHisController = require('../controllers/paymentHisController');

roouter.post('/', paymentHisController.paymentHis)


module.exports = router;