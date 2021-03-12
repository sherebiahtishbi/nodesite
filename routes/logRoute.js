const express = require('express')
const accessLog = require('./../models/accesslog')
const utils = require('./../routes/utils')
const config = require('./../resources/config')
const router = express.Router()

router.get('/', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        // let logs = await accessLog.find().sort({ accessDate: 'desc' }).limit(100)
        res.render('accesslog')
    } else {
        res.render('unauthorized')
    }

})

router.get('/filter/:fromdate/:todate', async (req, res) => {
    utils.getQuery(req.params.fromdate, req.params.todate)
        .then(async (daterange) => {
            let query = {
                accessDate: {
                    $gte: daterange.startdate,
                    $lte: daterange.enddate
                }
            }
            let logs = await accessLog.find(query).sort({ accessDate: 'desc' })
            if (logs.length > 0) {
                res.render('accesslog', { logs: logs })
            }
            else {
                let logs = []
                res.render('accesslog', { logs: logs })
            }
        })
        .catch((err) => {
            console.log('ERROR fetching logs!' + err)
        })
})

router.get('/filter/:date', async (req, res) => {
    let date = req.params.date
    utils.getQuery(date)
        .then(async (daterange) => {
            console.log('Date range received.')
            console.log(daterange)
            let query = {
                accessDate: {
                    $gte: daterange.startdate,
                    $lte: daterange.enddate
                }
            }
            console.log(query)
            let logs = await accessLog.find(query).sort({ accessDate: 'desc' })
            console.log('log data')
            console.log(logs)
            if (logs.length == 0) {
                let logs = []
            }
            res.send({ logs: logs })
        })
        .catch((err) => {
            console.log('ERROR fetching logs! ' + err)
        })
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
    console.log("Logging disabled temporarily!")
    // console.log('Saving log entry')
    // let accesslog = new accessLog()
    // console.log(req.body)
    // accesslog.page = req.body.page
    // accesslog.client = config.usermap[req.body.client]

    // console.log(accesslog)

    // try {
    //     console.log('Now saving')
    //     console.log(accesslog)

    //     accesslog = await accesslog.save()
    //     console.log('Log saved successfully')
    // } catch (err) {
    //     console.log(err)
    // }
})

module.exports = router