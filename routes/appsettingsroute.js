const express = require('express')
const AppSetting = require('./../models/appsettings')
const Hymn = require('./../models/hymn')
const router = express.Router()  

router.get('/', async (req, res) => { 
    let settings = await AppSetting.find()
    res.render('appsettings/appsettings', {settings:settings})
})

router.post('/updatesetting', async (req, res) => {
    let key = req.body.key
    let value = req.body.value
    let newSetting = { [key]: value }
    console.log(newSetting)
    try {
        await AppSetting.findOneAndUpdate(newSetting, {
            new: true,
            upsert: true
        })
        console.log('Setting updated successfuly!')
    } catch (e) {
        console.log('Error > ' + e)
    }
})

module.exports = router