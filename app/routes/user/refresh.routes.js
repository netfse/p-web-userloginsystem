const express = require('express');
const router = express.Router();
const refreshCollroller = require('../../controllers/refreshController');

router.get('/',refreshCollroller.refreshUser);

module.exports = router;