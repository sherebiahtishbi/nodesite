const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    version: {
        type: String,
        required: true
    },
    book: {
        type: String,
        required: true
    },
    chapter : {
        type: String,
        required: true
    },
    verse: {
        type: Number,
        required: true
    },
    note: {
        type:  String,
    },
    creatDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Note',noteSchema)
