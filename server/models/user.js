const mongoose = require('mongoose')
const userShema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true,
    },
})


const UserShema = mongoose.model('users', userShema)
module.exports = UserShema