const mongoose = require('mongoose')

const expenseCategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    categorytype: {
        type: String
    },
    comment: {
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

module.exports = mongoose.model('ExpenseCategory', expenseCategorySchema)
