const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    dateofexpense: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        default: 'None'
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

module.exports = mongoose.model('Expense', expenseSchema)
