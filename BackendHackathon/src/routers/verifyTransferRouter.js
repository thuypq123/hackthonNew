const express = require('express');
const router = express.Router();
const verify_transfer = require('../controllers/verifyTransferController');

router.post('/',verify_transfer.verifyTransfer);

module.exports = router;