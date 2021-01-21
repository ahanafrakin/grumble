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
                { $push: {users: {userObjectId: newUser._id, username: username, completed: false}} },
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

const interests = (roomId) => {
    return new Promise((resolve,reject) => {
        Room.findOne({roomId: roomId}, "placesQuery")
        .then((interests) => {
            resolve(interests.placesQuery)
        })
        .catch((err) => reject(err))
    })
}

const userComplete = ({roomId, username}) => {
    return new Promise((resolve,reject) => {
        Room.updateOne({roomId: roomId, "users.username": username}, 
        {$set: {"users.$.completed": true}})
        .then((result) => {resolve(result)})
        .catch((err) => {reject(err)})
    })
}

const allUsersComplete = (roomId) => {
    return new Promise((resolve, reject) => {
        Room.findOne({roomId: roomId}).lean()
        .then((result) => {
            for(user in result.users){
                if(result.users[user].completed == false) resolve(false)
            }
            resolve(true)
        })
        .catch((err) => reject(err))
    })
}

const checkFavourite = (roomId) => {
    let favouriteCount = {}
    let maxKeysArray = [];
    let maxValue = 0;
    let maxRating = 0;
    let bestPlace = 0;
    return new Promise((resolve, reject) => {
        Room.findOne({roomId: roomId})
        .then(async (result) => {
            // Go through each user
            for(user in result.users){
                // Go through the the accepted list and add them to favourite count
                await User.findById(result.users[user].userObjectId)
                .then((userResult) => {
                    for(place in userResult.accepted){
                        // If the place is in the dictionary already add one, else make it 1
                        if(userResult.accepted[place] in favouriteCount){
                            favouriteCount[userResult.accepted[place]] += 1
                        }
                        else{
                            favouriteCount[userResult.accepted[place]] = 1
                        }
                    }
                })
            }
            // All the accepted from the users are in favouriteCount, find one with highest count
            for(key in favouriteCount){
                if(favouriteCount[key] > maxValue){
                    maxKeysArray = [key]
                    maxValue = favouriteCount[key]
                }
                else if(favouriteCount[key] == maxValue){
                    maxKeysArray.push(key)
                }
            }

            if(maxKeysArray.length == 1){
                for(place in result.placesQuery){
                    if(result.placesQuery[place].place_id == maxKeysArray[0]){
                        resolve(result.placesQuery[place])
                    }
                }
            }
            else if(maxKeysArray.length>1){
                for(key in maxKeysArray){
                    for(place in result.placesQuery){
                        if(result.placesQuery[place].place_id == maxKeysArray[key] && result.placesQuery[place].rating > maxRating){
                            maxRating = result.placesQuery[place].rating
                            bestPlace = result.placesQuery[place]
                        }
                    }
                }
                resolve(bestPlace)
            }
            else{ resolve("all_declined") }

        })
        .catch((err)=> reject(err))
    })
}

const deleteRoom = (roomId) => {
    return new Promise((resolve,reject)=>{
        Room.findOneAndDelete({roomId: roomId})
        .then(() =>  {resolve(true)})
        .catch((err) => reject(err));
    })
}

module.exports = { roomUsers, addUser, deleteUser, deleteRoom, interests, userComplete, allUsersComplete, checkFavourite };