const express = require('express');
const mongoose = require('mongoose')
const axios = require('axios')
const router = express.Router()
let Room = require('../models/room.model')
let { makeId } = require('../helpers/helpers')

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
            roomId: makeId(6),
            lat: lat,
            lng: lng,
            searchTerms: searchTerms,
            numPlaces: numPlaces,
            placesQuery: placesQuery.data.results.slice(0,numPlaces),
            radius: radius,
            users: new Array()
        })
        newRoom.save()
            .then(() => res.json(newRoom))
            .catch(err => {console.log(err); res.status(400).json('Error: ' + err)} )
    })
    .catch(err => res.status(400).json('Error: ' + err))
        
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

router.route('/test').get((req,res) => test(req,res))

module.exports.router = router;