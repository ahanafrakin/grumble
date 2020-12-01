const { Schema } = require("mongoose");
const mongoose = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    roomId: {
        type: String,
        required: true,
        unique: false,
    },
    socketId:{
        type: String,
        required: true,
        unique: false,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

