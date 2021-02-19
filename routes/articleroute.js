const express = require('express')
const Article = require('./../models/article')
const Category = require('./../models/category')
const utils = require('./../routes/utils')
const router = express.Router()

router.get('/', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let articles = await Article.find().sort({ creatDate: 'desc' })
        res.render('article/articles', { articles: articles })
    } else {
        res.render('unauthorized')
    }
})

router.get('/filter/:fromdate/:todate', async (req, res) => {
    utils.getQuery(req.params.fromdate, req.params.todate)
        .then(async (daterange) => {
            let query = {
                creatDate: {
                    $gte: daterange.startdate,
                    $lte: daterange.enddate
                }
            }
            let articles = await Article.find(query).sort({ creatDate: 'desc' })
            if (articles.length > 0) {
                res.render('article/articles', { articles: articles })
            }
            else {
                let articles = []
                res.render('article/articles', { articles: articles })
            }
        })
        .catch((err) => {
            console.log('ERROR fetching notes!' + err)
        })
})

router.get('/filter/:date', async (req, res) => {
    let date = req.params.date
    utils.getQuery(date)
        .then(async (daterange) => {
            console.log('Date range received.')
            console.log(daterange)
            let query = {
                creatDate: {
                    $gte: daterange.startdate,
                    $lte: daterange.enddate
                }
            }
            console.log(query)
            let articles = await Article.find(query).sort({ creatDate: 'desc' })
            if (articles.length > 0) {
                res.render('article/articles', { articles: articles })
            }
            else {
                let articles = []
                res.render('article/articles', { articles: articles })
            }
        })
        .catch((err) => {
            console.log('ERROR fetching notes! ' + err)
        })
})


router.get('/show/:id', async (req, res) => {
    console.log('article id :' + req.params.id)
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let article = await Article.findById(req.params.id)
        res.render('article/showarticle', { article: article })
    } else {
        res.render('unauthorized')
    }
})

router.get('/add', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let article = new Article()
        let categories = await Category.find()
        res.render('article/addarticle', { article: article, categories: categories, mode: "Add" })
    } else {
        res.render('unauthorized')
    }
})

router.get('/edit/:id', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        let article = await Article.findById(req.params.id)
        let categories = await Category.find()
        res.render('article/editarticle', { article: article, categories: categories, mode: "Edit" })
    } else {
        res.render('unauthorized')
    }
})

router.put('/update/:id', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Updating diary')
        let article = await Article.findById(req.params.id)
        article.title = req.body.title
        article.category = req.body.category
        article.content = req.body.content
        try {
            article = await article.save()
            res.redirect('/articles')
        } catch (err) {
            console.log(err)
            res.render('article/editarticle', { article: article })
        }
    } else {
        res.render('unauthorized')
    }
})

router.post('/save', async (req, res) => {
    if (utils.isAuthorizedDevice(req.connection.remoteAddress, req.originalUrl) == 'Authorized') {
        console.log('Saving new article')
        let article = new Article()

        article.title = req.body.title
        article.category = req.body.category
        article.content = req.body.content

        try {
            console.log('Now saving')
            article = await article.save()
            res.redirect('/articles')
        } catch (err) {
            console.log(err)
            res.render('/addarticle', { article: article })
        }
    } else {
        res.render('unauthorized')
    }

})

module.exports = router