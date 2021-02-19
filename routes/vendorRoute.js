const express = require('express')
const vendor = require('./../models/vendor')
const config = require('./../resources/config')
const utils = require('./../routes/utils')
const router = express.Router()

//Vendor list
router.get('/', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        ShowVendors(res)
    } else {
        res.render('unauthorized')
    }
})

//add Vendor
router.get('/add', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        res.render('homefinance/vendors/addvendor', { vendor: new vendor() })
    } else {
        res.render('unauthorized')
    }
})

//edit Vendor
router.get('/edit/:id', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let _vendor = await vendor.findById(req.params.id)
        res.render('homefinance/vendors/editvendor', { vendor: _vendor })
    } else {
        res.render('unauthorized')
    }
})

//save Vendor
router.post('/save', async (req, res, next) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Saving vendor')
        req.vendor = new vendor()
        next()
    } else {
        res.render('unauthorized')
    }
}, SaveVendor())

//update Vendor
router.put('/update/:id', async (req, res, next) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Updating vendor')
        req.vendor = await vendor.findById(req.params.id)
        next()
    } else {
        res.render('unauthorized')
    }
}, SaveVendor())

// common save/update function for vendor
function SaveVendor(req, vendor) {
    return async (req, res) => {
        let _vendor = req.vendor
        _vendor.vendorname = req.body.vendorname
        _vendor.displayorder = req.body.displayorder
        _vendor.comments = req.body.comments
        _vendor.trackinbillpay = (req.body.trackinbillpay) ? true : false
        console.log(_vendor)
        try {
            _vendor = await _vendor.save()
            res.redirect('/finance/billpay')
        } catch (err) {
            console.log(err)
        }
    }
}

// show all vendors
async function ShowVendors(res) {
    let vendors = await vendor.find().sort({ displayorder: 'asc' })
    if (vendors.length > 0) {
        res.render('homefinance/vendors/vendors', { vendors: vendors })
    } else {
        res.render('homefinance/vendors/vendors', { vendors: [] })
    }
}

module.exports = router