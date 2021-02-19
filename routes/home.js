const express = require('express');
const router = require('./hymnroutes');
const route = express.Router()

router.get('/', (req,res) => { 
    res.render('index')
})

router.get('/', (req,res) => { 
    res.render('index')
})

router.get('/aboutus', (req,res) => { 
    res.render('aboutus')
})

module.exports = route;