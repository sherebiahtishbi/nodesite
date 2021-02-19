const express = require('express')
const pay_method = require('../models/paymentmethod')
const utils = require('../routes/utils')
const router = express.Router()

//payment method list
router.get('/', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        ShowPaymentMethods(res)
    } else {
        res.render('unauthorized')
    }
})

//add payment method
router.get('/add', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        res.render('homefinance/paymentmethod/addpaymentmethod', { paymethod: new pay_method() })
    } else {
        res.render('unauthorized')
    }
})

//edit payment method
router.get('/edit/:id', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let paymethod = await pay_method.findById(req.params.id)
        res.render('homefinance/paymentmethod/editpaymentmethod', { paymethod: paymethod })
    } else {
        res.render('unauthorized')
    }
})

//save payment method
router.post('/save', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Saving payment method')
        let paymethod = new pay_method()

        paymethod.methodname = req.body.methodname
        paymethod.comments = req.body.comments
        console.log(paymethod)

        try {
            console.log('Now saving')

            paymethod = await paymethod.save()
            console.log('Payment method saved successfully')
            ShowPaymentMethods(res)
        } catch (err) {
            console.log(err)
        }
    } else {
        res.render('unauthorized')
    }
})

//update payment method
router.put('/update/:id', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Updating expense category')
        let paymethod = await pay_method.findById(req.params.id)

        paymethod.methodname = req.body.methodname
        paymethod.comments = req.body.comments
        console.log(paymethod)

        try {
            console.log('Now updating')

            paymethod = await paymethod.save()
            console.log('Category upated successfully')
            ShowPaymentMethods(res)
        } catch (err) {
            console.log(err)
            res.render('homefinance/expensecategories/editcategory', { paymethod: paymethod })
        }
    } else {
        res.render('unauthorized')
    }
})

//delete payment method
router.delete('/delete/:id', async (req, res) => {
    expense_category.findByIdAndRemove(req.params.id, (err, cat) => {
        if (err) {
            console.log('ERROR : could not delete the category')
        } else {
            ShowPaymentMethods(res)
        }
    })
})

async function ShowPaymentMethods(res) {
    let pmethods = await pay_method.find().sort({ methodname: 'asc' })
    if (pmethods.length > 0) {
        res.render('homefinance/paymentmethod/paymentmethods', { pmethods: pmethods })
    } else {
        res.render('homefinance/paymentmethod/paymentmethods', { pmethods: [] })
    }
}

module.exports = router