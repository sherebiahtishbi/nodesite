const mongoose = require('mongoose')

const accesslogSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true
    },
    client: {
        type: String,
        required: true
    },
    accessDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('AccessLog', accesslogSchema)
