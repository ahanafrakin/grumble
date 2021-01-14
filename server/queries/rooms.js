const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
let Room = require('../models/room.model')
let User = require('../models/user.model')

const roomUsers = (roomId) => {
    // Find one returns document whereas find returns cursor
    return new Promise((resolve, reject) => {
        Room.findOne({roomId: roomId}, "users").lean()
        .then((foundUsers) => {
            resolve(foundUsers.users.map(user => user.username))
        })
        .catch(err => {reject(err)} )
    })
}

const addUser = (username, roomId, socketId) => {
    const newUser = new User({
        username: username,
        roomId: roomId,
        socketId: socketId
    })
    return new Promise((resolve, reject) => {
        newUser.save()
        .then(
            Room.updateOne({roomId: roomId},
                { $push: {users: {userObjectId: newUser._id, username: username}} },
                (err, result) => {
                    if (err){
                        reject(err);
                    }
                    else {
                        resolve(true);
                    }
                })
        )
        .catch((err)=> {reject(err)})
    })
}

const deleteUser = (userObjectId, roomId) => {
    return new Promise((resolve, reject) => {
        Room.updateOne({roomId: roomId}, { $pull: {users: {userObjectId: userObjectId}}})
        .then(() => {return Room.findOne({roomId: roomId}).lean()})
        .then((foundRoom) => {
            if(foundRoom.users.length == 0){
                deleteRoom(roomId)
                .then(() => {
                    resolve(true)
                })
                .catch((err) => {resolve(err)})
            }
            else{
                resolve(true)
            }
        })    
        .catch((err) => reject(err)) 
    })
}

const deleteRoom = (roomId) => {
    return new Promise((resolve,reject)=>{
        Room.findOneAndDelete({roomId: roomId})
        .then(() =>  {resolve(true)})
        .catch((err) => reject(err));
    })
}

module.exports = { roomUsers, addUser, deleteUser, deleteRoom };