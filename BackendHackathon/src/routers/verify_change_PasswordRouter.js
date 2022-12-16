const express = require('express');
const router = express.Router();
const verify_changePasswordController = require('../controllers/verify_changePasswordController');

router.post('/',verify_changePasswordController.verify_changePassword);

module.exports = router;