const express = require('express');
const router = express.Router();
const logoutCollroller = require('../../controllers/user/logoutController');

router.get('/', logoutCollroller.logoutUser);

module.exports = router;