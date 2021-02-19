const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    biography: {
        type: String,
    },
    creatDate: {
        type: Date,
        default: Date.now
    },
    convertedHtml: {
        type: String
    }
})

module.exports = mongoose.model('Author', authorSchema)
