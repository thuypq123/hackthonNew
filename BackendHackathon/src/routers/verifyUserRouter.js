const express = require('express');
const router = express.Router();
const {get_Key} = require('../lib/getkey');
const verifyUser = require('../controllers/verifyUserController');
router.post('/', verifyUser.postVerifyUser);

module.exports = router;