const mongoose = require('mongoose')
const listShema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    successList: {
        type: Boolean,
        required: true,
    },
    id: {
        type: String,
        required: true,
    }
})


const ListShema = mongoose.model('lists', listShema)
module.exports = ListShema