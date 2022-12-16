const express = require('express');
const router = express.Router();
const getKey = require('../controllers/getkeyController');

router.get('/', getKey.get_Key);

module.exports = router;