const router = require('express').Router()

router.use('/register', require('./register.routes'))
router.use('/refresh', require('./refresh.routes'))
router.use('/auth', require('./auth.routes'))
router.use('/logout', require('./logout.routes'))

router.use('/health', (req, res) => {
    res.end('Ok!')
})

module.exports = router