const express = require('express')
const Note = require('./../models/notes')
const utils = require('./utils')
const router = express.Router()

router.get('/', async (req, res) => {
    let dates = { startDate: '', endDate: '' }
    let notes = await Note.find().sort({ creatDate: 'desc' })
    if (notes.length > 0) {
        // console.log(notes)    
        res.render('meditation/meditations', { notes: notes, dates: dates })
    } else {
        let notes = []
        res.render('meditation/meditations', { notes: notes, dates: dates })
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
            let notes = await Note.find(query).sort({ creatDate: 'desc' })
            let dates = {
                startDate: req.params.fromdate,
                endDate: req.params.todate
            }
            if (notes.length > 0) {
                res.render('meditation/meditations', { notes: notes, dates: dates })
            }
            else {
                let notes = []
                res.render('meditation/meditations', { notes: notes, dates: dates })
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
            let notes = await Note.find(query).sort({ creatDate: 'desc' })
            // console.log(notes)
            let dates = { startDate: daterange.startdate, endDate: daterange.enddate }
            console.log(notes)
            if (notes.length > 0) {
                res.render('meditation/meditations', { notes: notes, dates: dates })
            }
            else {
                let notes = []
                res.render('meditation/meditations', { notes: notes, dates: dates })
            }
        })
        .catch((err) => {
            console.log('ERROR fetching notes! ' + err)
        })
})

module.exports = router

