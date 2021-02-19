const mongoose = require('mongoose')

const credentialSchema = new mongoose.Schema({
    site: {
        type: String,
        required: true
    },
    siteurl: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    comment: {
        type: String
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Credential', credentialSchema)
