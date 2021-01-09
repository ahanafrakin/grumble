const express = require('express');
const mongoose = require('mongoose')
const axios = require('axios')
const router = express.Router()
let Room = require('../models/room.model')
let User = require('../models/user.model')

const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

const findUsers = (req, res) => {
    // Find one returns document whereas find returns cursor
    Room.findOne({roomId: req.params.id}, "users").lean()
        .then(foundUsers => res.json(foundUsers))
        .catch(err => res.status(400).json('Error: ' + err) )
}

const roomAvailable = (req, res) => {
    Room.findOne({roomId: req.params.id}, (err, result) =>{
        if(!result){
            res.status(400).json('Error: ' + err) 
        }
        else{
            
            res.json({'Status': true})
        }
    })
}

const userAvailable = (req, res) => {
    Room.findOne({roomId: req.params.id}, "users", (err, result) => {
        if(!result){
            res.status(400).json('Error: ' + err) 
        }
        else{
            let filteredUsers = result.users.filter((receivedUser) => {
                if(receivedUser.username == req.query.username){
                    return true
                }
                else{
                    return false
                }           
            })
            if(filteredUsers.length >= 1){
                res.json({'Status': false}) 
            }
            else{
                res.json({'Status': true})
            }
        }
    })
}

const createRoom = (req, res) => {
    // Fix later, this is going to generate a random room id.
    // Currently not checking if there are available ids possible
    let lat = req.body.lat
    let lng = req.body.lng
    let radius = req.body.radius * 1000
    let numPlaces = req.body.numPlaces
    let searchTerms = req.body.searchTerms
    axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${searchTerms}&key=${process.env.GOOGLE_API_KEY}`)
    .then((placesQuery)=>{
        const newRoom = new Room({
            roomId: makeid(6),
            lat: lat,
            lng: lng,
            searchTerms: searchTerms,
            numPlaces: numPlaces,
            placesQuery: placesQuery.data,
            radius: radius,
            users: new Array()
        })
        newRoom.save()
            .then(() => res.json(newRoom))
            .catch(err => {console.log(err); res.status(400).json('Error: ' + err)} )
    })
    .catch(err => res.status(400).json('Error: ' + err))
        
}

// const addUser = (req, res) => {
//     const username = req.body.username
//     const roomId = req.params.id
//     const socketId = req.body.socketId
//     console.log(req.params.id)
//     const newUser = new User({
//         username: username,
//         roomId: roomId,
//         socketId: socketId
//     })
//     newUser.save()
//     .then(
//         Room.updateOne({roomId: req.params.id},
//             { $push: {users: newUser._id} },
//              (err, result) => {
//                  if (err){
//                      res.send(err)
//                  }
//                  else {
//                      res.send(result)
//                  }
//              })
//     )
//     .catch(err=>res.send(err))
    
// }
const addUser = (username, roomId, socketId) => {
    const newUser = new User({
        username: username,
        roomId: roomId,
        socketId: socketId
    })
    newUser.save()
    .then(
        Room.updateOne({roomId: roomId},
            { $push: {users: newUser._id} },
             (err, result) => {
                 if (err){
                     console.log(err)
                     return(err)
                    //  res.send(err)
                 }
                 else {
                    return
                    //  res.send(result)
                 }
             })
    )
    .catch((err)=> {console.log(err); return(err)})
}

const deleteUser = (req, res) => {
    const username = req.body.username
    Room.updateOne({roomId: req.params.id},
        { $pull: {users: {username: username}}},
        (err, result) => {
            if (err){
                res.send(err)
            }
            else {
                Room.findOne({roomId: req.params.id}).lean()
                    .then(foundRoom => {
                        if(foundRoom.users.length == 0){
                            console.log("Deleting room")
                            deleteRoom(req, res)
                        }
                        else{
                            res.send(result)
                        }
                    })
                    .catch(err => res.status(400).json('Error: ' + err) ) 
            }
        })
}

const deleteRoom = (req, res) => {
    Room.findOneAndDelete({roomId: req.params.id})
        .then(() => res.json(`Successfully deleted ${req.params.id}`))
        .catch(err => res.status(400).json('Error: ' + err));
}

const test = (req, res) => {
    axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyBx9OOKHZvIsfRoRHttvMBfpl-nh8ND3Xc")
    .then(response=>console.log(typeof(response.data))
    )
    .catch(error=>console.log(error))
}

// Returns true if the room exists or else catches error
router.route('/:id/room_available').get((req, res) => roomAvailable(req, res));

router.route('/:id/user_available').get((req, res) => userAvailable(req, res));

// Create a room and give it a random string of 6 characters.
// Check if that string already exists.
router.route('/create_room').post((req, res) => createRoom(req, res));

router.route('/:id/users').get((req, res) => findUsers(req, res));

router.route('/:id/add_user').put((req, res) => addUser(req, res));

router.route('/:id/delete_user').delete((req, res) => deleteUser(req, res));

router.route('/:id/delete_room').delete((req, res) => deleteRoom(req, res))

router.route('/test').get((req,res) => test(req,res))

module.exports.addUser = addUser;
module.exports.router = router;
// exports.addUser = addUser;