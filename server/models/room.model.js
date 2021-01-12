const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.model.js').schema;

const roomSchema = new Schema({
    roomId: {
        _id : true,
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    lat: {
        type: Number,
        required: true,
        unique: false
    },
    lng: {
        type: Number,
        required: true,
        unique: false
    },
    searchTerms: {
        type: String,
        requried: true
    },
    users: {
        type: [{userObjectId: mongoose.Schema.Types.ObjectId, username: String}],
        required: true
    },
    radius: {
        type: Number,
        required: true
    },
    numPlaces: {
        type: Number,
        required: true
    },
    placesQuery:{
        type: Object,
        required: true
    }
},
{
    timestamps: true,
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

