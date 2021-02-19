const express = require('express')
const credential = require('../models/credential')
const utils = require('../routes/utils')
const router = express.Router()

router.get('/', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        ShowCreds(res)
    } else {
        res.render('unauthorized')
    }
})

async function ShowCreds(res) {
    let creds = await credential.find().sort({ site: 'asc' })
    if (creds.length > 0) {
        // console.log(notes)    
        res.render('creds/creds', { creds: creds, sortorder: 'asc' })
    } else {
        let creds = []
        res.render('creds/creds', { logs: logs, sortorder: 'desc' })
    }
}

router.get('/add', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('GET /creds/add')
        res.render('creds/addcred', { cred: new credential() })
    } else {
        res.render('unauthorized')
    }
})

router.get('/edit/:id', async (req, res) => {
    console.log('GET /creds/edit/:id')
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let cred = await credential.findById(req.params.id)
        // console.log(hymn)
        res.render('creds/editcred', { cred: cred })
    } else {
        res.render('unauthorized')
    }
})

router.get('/sort/:key/:order', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('GET /logs/sort/:key/:order')
        let sortcolumn = req.params.key
        let sortorder = (req.params.order == undefined) ? 'asc' : req.params.order
        let logs
        switch (sortcolumn) {
            case 'page':
                logs = await accessLog.find().sort({ page: sortorder })
                break;
            case 'client':
                logs = await accessLog.find().sort({ client: sortorder })
                break;
            case 'accessdate':
                logs = await accessLog.find().sort({ accessDate: sortorder })
                break;
            default:
                logs = await accessLog.find().sort({ page: sortorder })
        }
        if (sortorder == 'desc') {
            sortorder = 'asc'
        } else {
            sortorder = 'desc'
        }
        res.render('accesslog', { logs: logs, sortorder: sortorder })
    } else {
        res.render('unauthorized')
    }
})


router.post('/save', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Saving cred entry')
        let cred = new credential()

        cred.site = req.body.sitename
        cred.siteurl = req.body.siteurl
        cred.username = req.body.siteuname
        cred.password = req.body.sitepwd
        cred.comment = req.body.comment

        console.log(cred)

        try {
            console.log('Now saving')

            cred = await cred.save()
            console.log('Log saved successfully')
            ShowCreds()
        } catch (err) {
            console.log(err)
        }
    } else {
        res.render('unauthorized')
    }
})

router.put('/update/:id', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Updating credential')
        let cred = await credential.findById(req.params.id)

        cred.site = req.body.sitename
        cred.siteurl = req.body.siteurl
        cred.username = req.body.siteuname
        cred.password = req.body.sitepwd
        cred.comment = req.body.comment

        try {
            cred = await cred.save()
            res.redirect('/creds')
        } catch (err) {
            console.log(err)
            res.render('creds/edit/<%=cred.id%>', { cred: cred })
        }
    } else {
        res.render('unauthorized')
    }
})

module.exports = router