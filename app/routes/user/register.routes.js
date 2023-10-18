const express = require('express');
const router = express.Router();
const registerCollroller = require('../../controllers/user/registerController');

router.post('/',registerCollroller.registerUser);

module.exports = router;