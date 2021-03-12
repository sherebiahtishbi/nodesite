const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
    vendorname: {
        type: String,
        required: true
    },
    comments: {
        type: String
    },
    displayorder: {
        type: Number
    },
    trackinbillpay: {
        type: Boolean,
        default: false
    },
    isCreditCard: {
        type: Boolean,
        default: false
    },
    creatDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date
    }
})

module.exports = mongoose.model('Vendor', vendorSchema)
