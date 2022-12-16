const express = require('express');
const router = express.Router();
const {resendMail} = require('../controllers/resendMailController');

router.post('/', resendMail);

module.exports = router;