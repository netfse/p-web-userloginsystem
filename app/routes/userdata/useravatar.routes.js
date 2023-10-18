const express = require('express');
const router = express.Router();
const userAvatarCollroller = require('../../controllers/userdata/userAvatarCollroller');

router.get('/get', userAvatarCollroller.getUserAvatar);
router.post('/update', userAvatarCollroller.updateUserAvatar);
router.get('/delete', userAvatarCollroller.deleteUseravatar);

module.exports = router;