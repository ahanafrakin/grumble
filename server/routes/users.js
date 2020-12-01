const express = require('express');
const router = express.Router()
let User = require('../models/user.model');
const { route } = require('./rooms');
let Room = require('../models/room.model');
const { response } = require('express');

router.route('/').get((req,res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req,res) =>{
    const username = req.body.username;
    const roomId = req.body.roomId;
    const socketId = req.body.socketId;
    const newuser = new User({username, roomId, socketId})

    newuser.save()
        .then(() => res.json("User added!"))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete_by_socketid/:id').delete((req,res)=>{
    User.findOne({socketId: req.params.id})
    .then((findResult)=>{
        Room.updateOne({roomId: findResult.roomId}, 
            { $pull: {users: findResult._id}},
            (err, result) => {
            if(err){res.status(400).json('Error: ' + err)}
            })
        User.findOneAndDelete({socketId: req.params.id})
        .then(() => res.json(`Successfully deleted ${req.params.id}`))
        .catch(err => res.status(400).json('Error: ' + err))
    }
    )
    .catch(err => res.status(400).json('Error: ' + err))
    
})

router.route('/delete_by_room').delete((req,res)=>{
    User.findAndDelete({roomId: req.body.bodyId})
    .then(() => res.json(`Successfully deleted ${req.body.bodyId}`))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/find_user').get((req,res)=>{
    User.findOne({roomId: req.body.roomId})
    .then((result) => res.json(result))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/find_user_by_socketid/:id').get((req,res)=>{
    User.findOne({socketId: req.params.id})
    .then((result) => res.json(result))
    .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router;
