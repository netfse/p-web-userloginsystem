const express = require('express');
const router = express.Router();
const logoutCollroller = require('../../controllers/logoutController');

router.post('/', logoutCollroller.logoutUser);

module.exports = router;