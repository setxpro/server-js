const mongoose = require('mongoose')

const User = mongoose.model('Usuario', {
    name: String,
    login: String,
    email: String,
    password: String
})

module.exports = User