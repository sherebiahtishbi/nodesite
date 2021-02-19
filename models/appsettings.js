const mongoose = require('mongoose')

const appSettingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
    },
    creatDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('AppSettings', appSettingSchema)
