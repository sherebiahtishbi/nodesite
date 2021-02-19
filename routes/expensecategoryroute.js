const express = require('express')
const expense_category = require('../models/expensecategory')
const config = require('../resources/config')
const utils = require('../routes/utils')
const router = express.Router()

/* Expense Categories */

//categories list
router.get('/:type', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        ShowCategories(res, req.params.type)
    } else {
        res.render('unauthorized')
    }
})

//add category
router.get('/add/:type', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let ctype = (req.params.type == undefined) ? 'Expense' : req.params.type
        let category = await new expense_category()
        category.categoryType = ctype
        res.render('homefinance/expensecategories/addcategory', { category: category })
    } else {
        res.render('unauthorized')
    }
})

//edit category
router.get('/edit/:id', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let category = await expense_category.findById(req.params.id)
        res.render('homefinance/expensecategories/editcategory', { category: category })
    } else {
        res.render('unauthorized')
    }
})

//save category
router.post('/save', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Saving expense category')
        let category = new expense_category()

        console.log(req.body.type)
        category.categoryName = req.body.name
        category.categorytype = req.body.type
        category.comment = req.body.comment
        console.log(category)

        try {
            console.log('Now saving')

            category = await category.save()
            console.log('Category saved successfully')
            ShowCategories(res)
        } catch (err) {
            console.log(err)
        }
    } else {
        res.render('unauthorized')
    }
})

//update category
router.put('/update/:id', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Updating expense category')
        let category = await expense_category.findById(req.params.id)

        console.log(req.body.type)
        category.categoryName = req.body.name
        category.categorytype = req.body.type
        category.comment = req.body.comment
        console.log(category)

        try {
            console.log('Now updating')

            category = await category.save()
            console.log('Category upated successfully')
            ShowCategories(res)
        } catch (err) {
            console.log(err)
            res.render('homefinance/expensecategories/editcategory', { category: category })
        }
    } else {
        res.render('unauthorized')
    }
})

//delete category
router.delete('/delete/:id', async (req, res) => {
    expense_category.findByIdAndRemove(req.params.id, (err, cat) => {
        if (err) {
            console.log('ERROR : could not delete the category')
        } else {
            ShowCategories(res)
        }
    })
})

async function ShowCategories(res, type) {
    let categories = await expense_category.find({ categorytype: type }).sort({ categoryName: 'asc' })
    console.log(type)
    console.log(categories)
    if (categories.length > 0) {
        res.render('homefinance/expensecategories/categories', { categories: categories, cattype: type })
    } else {
        res.render('homefinance/expensecategories/categories', { categories: [], cattype: type })
    }
}

module.exports = router