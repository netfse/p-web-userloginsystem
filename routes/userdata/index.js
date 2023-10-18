const router = require('express').Router()

router.use('/useravatar', require('./useravatar.routes'))

router.use('/health', (req, res) => {
    res.end('Ok!')
})

module.exports = router