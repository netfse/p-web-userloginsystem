const express = require('express');
const router = express.Router();
const registerCollroller = require('../../controllers/authController');

router.post('/',registerCollroller.authUser);

module.exports = router;