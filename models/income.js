const mongoose = require('mongoose')

const incomeSchema = new mongoose.Schema({
    incomemonth: {
        type: Number,
        required: true
    },
    incomeyear: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    incometype: {
        type: String,
        required: true
    },
    comments: {
        type: String
    },
    creatDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date
    }
})

module.exports = mongoose.model('Income', incomeSchema)
