const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'None'
    },
    url: {
        type: String,
        required: true
    },
    channelname: {
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

module.exports = mongoose.model('Article', articleSchema)
