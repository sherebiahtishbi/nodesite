const express = require('express')
const expense = require('../models/expense')
const expense_category = require('../models/expensecategory')
const utils = require('../routes/utils')
const router = express.Router()

//Expense list
router.get('/', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        ShowExpenses(res)
    } else {
        res.render('unauthorized')
    }
})

//add expense
router.get('/addexpense', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let expcategories = await expense_category.find().sort({ categoryName: 'asc' })
        let pmethods = await pay_method.find().sort({ methodname: 'asc' })
        res.render('homefinance/addexpense', { expense: new expense(), expcategories: expcategories, pmethods: pmethods })
    } else {
        res.render('unauthorized')
    }
})

//edit expense
router.get('/paymentmethod/edit/:id', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let paymethod = await pay_method.findById(req.params.id)
        res.render('homefinance/paymentmethod/editpaymentmethod', { paymethod: paymethod })
    } else {
        res.render('unauthorized')
    }
})

//save expense
router.post('/save', async (req, res, next) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Saving expense')
        req.expense = new expense()
        next()
    } else {
        res.render('unauthorized')
    }
}, SaveExpense())

//update expense
router.put('/paymentmethod/update/:id', async (req, res, next) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Updating expense')
        req.expense = await expense.findById(req.params.id)
        next()
    } else {
        res.render('unauthorized')
    }
}, SaveExpense())

function SaveExpense(req, exp) {
    return async (req, res) => {
        let exp = req.expense
        exp.dateofexpense = req.body.dateofexpense
        exp.category = req.body.expensecategory
        exp.amount = req.body.amount
        exp.vendor = req.body.vendor
        exp.paymentmethod = req.body.paymethod
        exp.comments = req.body.comment
        console.log(exp)
        try {
            exp = await exp.save()
            res.redirect('/finance')
        } catch (err) {
            console.log(err)
        }
    }
}

async function ShowExpenses(res) {
    let dates = { startDate: '', endDate: '' }
    let expenses = await expense.find().sort({ creatDate: 'desc' })
    let categories = await expense_category.find().sort({ categoryName: 'asc' })
    let pmethods = await pay_method.find().sort({ methodname: 'asc' })
    if (expenses.length > 0) {
        res.render('homefinance/financehome', { expenses: expenses, pmethods: pmethods, categories: categories })
    } else {
        res.render('homefinance/financehome', { expenses: [], pmethods: pmethods, categories: [] })
    }
}

async function ShowPaymentMethods(res) {
    let pmethods = await pay_method.find().sort({ methodname: 'asc' })
    if (pmethods.length > 0) {
        res.render('homefinance/paymentmethod/paymentmethods', { pmethods: pmethods })
    } else {
        res.render('homefinance/paymentmethod/paymentmethods', { pmethods: [] })
    }
}

module.exports = router