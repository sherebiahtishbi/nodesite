const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'None'
    },
    content: {
        type: String,
        required: true  
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
