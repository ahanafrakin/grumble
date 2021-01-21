const express = require('express');
const mongoose = require('mongoose')
let User = require('../models/user.model');
let Room = require('../models/room.model');
let { findUsers, addUser, deleteUser, deleteRoom } = require('../queries/rooms');

const allUsers = () => {
    return new Promise((resolve, reject) => {
        User.find()
        .then(users => {resolve(users)})
        .catch(err => {reject(err)});
    })
};

const deleteBySocketId = (socketId) => {
    return new Promise((resolve, reject) => {
        User.findOne({socketId: socketId})
        .then((findResult)=>{return deleteUser(findResult._id, findResult.roomId) })
        .then(() => {return User.findOneAndDelete({socketId: socketId})})
        .then(() => {resolve(true)})
        .catch(err => {reject(err)})
    })
}

const findUserBySocketId = (socketId) => {
    return new Promise((resolve, reject) => {
        User.findOne({socketId: socketId})
        .then((result) => {resolve(result)})
        .catch(err => {reject(err)})
    })
}

const addUserResults = ({socketId, accepted, declined}) => {
    
    return new Promise((resolve,reject) => {
        let username = ''
        let roomId = ''
        User.findOne({socketId: socketId})
        .then((result) => {
            username = result.username
            roomId = result.roomId
            result.accepted = accepted.current;
            result.declined = declined.current;
            result.save()
        })
        .then(() => {resolve({roomId, username})})
        .catch(err => {reject(err)})
    })
}

module.exports = { allUsers, deleteBySocketId, findUserBySocketId, addUserResults };
