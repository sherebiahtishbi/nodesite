const express = require('express')
const income = require('../models/income')
const incometype = require('../models/expensecategory')
const config = require('../resources/config')
const utils = require('../routes/utils')
const router = express.Router()

//Income list
router.get('/', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        ShowIncomes(res)
    } else {
        res.render('unauthorized')
    }
})

//json service to provide income data
router.get('/incomedata/:year', async (req, res) => {
    console.log(req.params.year)
    let year
    if (req.params.year == undefined || req.params.year == 'Current') {
        year = new Date().getFullYear()
    } else {
        year = req.params.year
    }
    let incomes = await income.find({ incomeyear: year }).sort({ incomemonth: 'asc' })
    let lastyearincomes = await income.find({ incomeyear: year - 1 }).sort({ incomemonth: 'asc' })
    let incometypes = await incometype.find({ categorytype: 'Income' }).sort({ categoryName: 'asc' })

    console.log('Fetched income data')
    // console.log(incomes)

    if (incomes.length > 0) {
        res.send({ incomes: incomes, lastyearincomes: lastyearincomes, incometypes: incometypes })
    } else {
        res.send({ incomes: [], lastyearincomes: lastyearincomes, incometypes: incometypes })
    }
})

//add Income
router.get('/add', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        res.render('homefinance/income/addincome', { income: new income(), years: config.years, months: config.months })
    } else {
        res.render('unauthorized')
    }
})

//add new bill payment
router.get('/add/:target', async (req, res) => {
    console.log("income/add")
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let _income = new income()
        console.log('Target >> ' + req.params.target)
        if (req.params.target == 'none') {
            _income.incomemonth = new Date().getMonth() + 1
            _income.incomeyear = new Date().getFullYear()
        } else {
            let incomeparams = req.params.target.split('|')
            console.log(incomeparams)
            _income.incometype = incomeparams[0]
            _income.incomeyear = (incomeparams[1] == 'current') ? new Date().getFullYear() : incomeparams[1]
            _income.incomemonth = incomeparams[2]
        }
        let incometypes = await incometype.find({ categorytype: 'Income' }).sort({ categoryName: 'asc' })
        res.render('homefinance/income/addincome', { income: _income, months: config.months, years: config.years, incometypes: incometypes })
    } else {
        res.render('unauthorized')
    }
})

//edit Income
router.get('/edit/:id', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let _income = await income.findById(req.params.id)
        let incometypes = await incometype.find({ categorytype: 'Income' }).sort({ categoryName: 'asc' })
        res.render('homefinance/income/editincome', { income: _income, incometypes: incometypes, years: config.years, months: config.months })
    } else {
        res.render('unauthorized')
    }
})

//save Income
router.post('/save', async (req, res, next) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Saving income')
        req.income = new income()
        next()
    } else {
        res.render('unauthorized')
    }
}, SaveIncome())

//update Income
router.put('/update/:id', async (req, res, next) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Updating income')
        req.income = await income.findById(req.params.id)
        next()
    } else {
        res.render('unauthorized')
    }
}, SaveIncome())

// common save/update function for income
function SaveIncome(req, income) {
    return async (req, res) => {
        let _income = req.income
        _income.incomemonth = req.body.month
        _income.incomeyear = req.body.year
        _income.amount = (req.body.amount == undefined || req.body.amount == '' || req.body.amount == null) ? 0 : req.body.amount
        _income.incometype = req.body.incometype
        _income.comments = req.body.comments
        console.log(_income)
        try {
            _income = await _income.save()
            console.log(_income)
            // res.redirect('/finance/billpay')
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

// show all incomes
async function ShowIncomes(res) {
    let incomes = await income.find().sort({ incomeyear: 'asc', incomemonth: 'asc' })
    if (incomes.length > 0) {
        res.render('homefinance/income/incomelist', { incomes: incomes, months: config.months })
    } else {
        res.render('homefinance/income/incomelist', { incomes: [] })
    }
}

module.exports = router