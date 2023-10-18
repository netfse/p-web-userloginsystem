const router = require('express').Router()

router.use((req, res, next) => {
    req.auth = {}
    next()
})

router.use('/health', (req, res) => {
    res.end('Ok!')
})

router.use('/user', require('./user'))
router.use('/userdata', require('./userdata'))

module.exports = router