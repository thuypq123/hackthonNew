const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');

router.post('/', balanceController.getBalance);

module.exports = router;