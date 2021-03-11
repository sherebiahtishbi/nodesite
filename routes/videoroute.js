const express = require('express')
const utils = require('./utils')
const config = require('../resources/config')
const router = express.Router()

//show bill payments for current year
router.get('/', async (req, res) => {
    console.log('Path > ' + req.originalUrl)
    try {
        let authorized = utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl)
        if (authorized == 'Authorized') {
            console.log('Authorized : billpay/')
            res.render('homefinance/billpay/yearlyview',
                {
                    months: config.months,
                    years: config.years,
                    selectedyear: new Date().getFullYear()
                })
        } else {
            console.log('Unauthorized : billpay/')
            res.render('unauthorized')
        }
    } catch (err) {
        console.log(err)
    }
})

//add new bill payment
router.get('/add/:target', async (req, res) => {
    console.log("billpay/add")
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let _billpay = new billpay()
        console.log('Target >> ' + req.params.target)
        if (req.params.target == 'none') {
            _billpay.paymonth = new Date().getMonth() + 1
            _billpay.payyear = new Date().getFullYear()
        } else {
            let payparams = req.params.target.split('|')
            console.log(payparams)
            _billpay.vendor = payparams[0]
            _billpay.payyear = (payparams[1] == 'current') ? new Date().getFullYear() : payparams[1]
            _billpay.paymonth = payparams[2]
        }
        let vendors = await vendor.find().sort({ vendorname: 'asc' })
        let paymethods = await paymethod.find().sort({ methodname: 'asc' })
        res.render('homefinance/billpay/addbillpayment',
            {
                billpay: _billpay,
                months: config.months,
                years: config.years,
                vendors: vendors,
                paymethods: paymethods
            })
    } else {
        res.render('unauthorized')
    }
})

//show bil payments for selected year
router.get('/year/:year', async (req, res) => {
    let year = req.params.year
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        ShowBillPayments(res, year)
    } else {
        res.render('unauthorized')
    }
})

//edit existing bill payment
router.get('/edit/:id', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let _billpay = await billpay.findById(req.params.id)
        console.log(_billpay)
        let vendors = await vendor.find().sort({ vendorname: 'asc' })
        let paymethods = await paymethod.find().sort({ methodname: 'asc' })
        res.render('homefinance/billpay/editbillpayment',
            {
                billpay: _billpay,
                months: config.months,
                years: config.years,
                vendors: vendors,
                paymethods: paymethods
            })
    } else {
        res.render('unauthorized')
    }
})

//save bill payment 
router.post('/save', async (req, res, next) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Saving bill payment')
        req.billpay = new billpay()
        next()
    } else {
        res.render('unauthorized')
    }
}, SaveBillpayment())

//update bill payment 
router.put('/update/:id', async (req, res, next) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Updating bill payment')
        req.billpay = await billpay.findById(req.params.id)
        next()
    } else {
        res.render('unauthorized')
    }
}, SaveBillpayment())

//json service to provide data
router.get('/billpaydata/:year', async (req, res) => {
    console.log(req.params.year)
    try {
        let year
        if (req.params.year == undefined || req.params.year == 'Current') {
            year = new Date().getFullYear()
        } else {
            year = req.params.year
        }
        let payments = await billpay.find({ payyear: year }).sort({ vendor: 'asc', paymonth: 'asc' })
        let lastyearpayments = await billpay.find({ payyear: year - 1 }).sort({ vendor: 'asc', paymonth: 'asc' })
        let vendors = await vendor.find({ trackinbillpay: true }).sort({ displayorder: 'asc' })

        console.log('Fetched billpay data')
        // console.log(payments)

        if (payments.length > 0) {
            res.send({
                payments: payments,
                lastyearpayments: lastyearpayments,
                vendors: vendors
            })
        } else {
            res.send({
                payments: [],
                lastyearpayments: lastyearpayments,
                vendors: vendors
            })
        }
    } catch (err) {
        console.log(err)
    }
})

// common save/update function for vendor
function SaveBillpayment(req, billpay) {
    return async (req, res) => {
        console.log(req.body.includeintotal)
        let _billpay = req.billpay
        _billpay.paymonth = req.body.month
        _billpay.payyear = req.body.year
        _billpay.vendor = req.body.vendor
        _billpay.amount = (req.body.amount == undefined || req.body.amount == '' || req.body.amount == null) ? 0 : req.body.amount
        _billpay.paymethod = req.body.paymethod
        _billpay.includeintotal = (req.body.includeintotal) ? true : false
        _billpay.comments = req.body.comments
        console.log(_billpay)
        try {
            _billpay = await _billpay.save()
            // res.redirect('/finance/billpay', { selectedyear: _billpay.payyear, years: config.years })
            res.render('homefinance/billpay/yearlyview',
                {
                    months: config.months,
                    years: config.years,
                    selectedyear: req.body.year
                })

        } catch (err) {
            console.log(err)
        }
    }
}

// OBSOLETE
// Shows all billpayments
// Loading of data is done from the client script /js/billpayview.js by makign call to route "/billpaydata/:year"
//
// async function ShowBillPayments(res, year) {
//     if (year == undefined)
//         year = new Date().getFullYear()
//     // let payments = await billpay.find({ payyear: year }).sort({ vendor: 'asc', paymonth: 'asc' })

//     console.log('Fetched billpay data')

//     if (payments.length > 0) {
//         res.render('homefinance/billpay/yearlyview', { months: config.months, years: config.years })
//     } else {
//         let payments = []
//         res.render('homefinance/billpay/yearlyview', { months: config.months, years: config.years })
//     }
// }

module.exports = router

