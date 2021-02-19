const mongoose = require('mongoose')

const hymnSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
    },
    refrain: {
        type: String
    },
    stanza1: {
        type: String,
        required: true
    },
    stanza2: {
        type: String
    },
    stanza3: {
        type: String
    },
    stanza4: {
        type: String
    },
    stanza5: {
        type: String
    },
    stanza6: {
        type: String
    },
    stanza7: {
        type: String
    },
    stanza8: {
        type: String
    },
    stanza9: {
        type: String
    },
    stanza10: {
        type: String
    },
    lastSungDate: {
        type: Date
    },
    sungCount: {
        type: Number
    },
    creatDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Hymn', hymnSchema)
