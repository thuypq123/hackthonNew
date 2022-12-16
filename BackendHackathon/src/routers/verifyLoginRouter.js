const express = require('express');
const router = express.Router();
const verifyLoginController = require('../controllers/verifyLoginController');

router.post('/', verifyLoginController.verifyLogin);

module.exports = router;