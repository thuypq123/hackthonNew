const express = require('express');
const router = express.Router();
const tranhisController = require('../controllers/tranhisController');

router.post('/', tranhisController.tranhis);

module.exports = router;