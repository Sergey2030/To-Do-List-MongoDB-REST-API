const mongoose = require('mongoose')
const currentUserShema = new mongoose.Schema({
    currentUser: {
        type: String,
        required: true,
    }
})

const CurrentUserShema = mongoose.model('currents', currentUserShema)
module.exports = CurrentUserShema