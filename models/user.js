const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date    
    },
    lastLogin: {
        type: Date
    }
})

module.exports = mongoose.model('User', userSchema)
