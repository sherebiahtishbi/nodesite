const mongoose = require('mongoose')

const paymentMethodSchema = new mongoose.Schema({
    methodname: {
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

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema)
