const mongoose = require('mongoose')

const billpaySchema = new mongoose.Schema({
    paymonth: {
        type: Number,
        required: true
    },
    payyear: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    paymentmethod: {
        type: String,
    },
    includeintotal: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model('Billpay', billpaySchema)
