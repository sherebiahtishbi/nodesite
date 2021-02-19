const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        res.render('squidreports/index')
    } else {
        res.render('unauthorized')
    }
})