//Need to do imports like this because we're in JS environment, not react
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const http = require('http');
const axios = require('axios');
require('dotenv').config();
const { roomUsers, addUser, deleteUser, deleteRoom } = require("./queries/rooms")
const { allUsers, deleteBySocketId, findUserBySocketId } = require("./queries/users")
const roomsRouter = require("./routes/rooms").router


//TODO: Figure out how to change env variables (I think its in package.json)
const PORT = process.env.PORT || 5000

//Mongodb Connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log("MongooseDB database established successfully");
})

const BACKENDLINK = "http://localhost:5000"
const { callbackify } = require('util');
const { query } = require('express');
const app = express();
const server = http.createServer(app);
app.use(cors())
app.use(express.json());

//When user goes to /room, it would load what's in roomsRouter
app.use('/rooms', roomsRouter);

server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`));
const io = socketio.listen(server);
io.origins('*:*')

const adminUsername = 'Admin'

io.on('connection', (socket) => {
    console.log('We have a new connection');

    socket.on('join', ({ roomId, username }) => {
        addUser(username, roomId, socket.id)
        .then(addUserRes => {
            console.log(`Successfully added ${username} to the room.`)
            socket.join(roomId)
        
            socket.emit('message', {user: adminUsername, message: `${username} welcome to the room ${roomId}`})
            socket.broadcast.to(roomId).emit('message', {user: adminUsername, message: `${username} has joined.`})

            return roomUsers(roomId)
        })
        .then(usersList => {
            io.to(roomId).emit('roomUsers', {
                roomId: roomId,
                usersList: usersList
            })
        })
        .catch(err => console.log(err))
    });

    socket.on('sendMessage', (message)=>{
        //We have the id from the socket that sent the message
        findUserBySocketId(socket.id)
        .then((queryResult) => {
            send_msg = {
                user: queryResult.username,
                message: message
            }
            io.to(queryResult.roomId).emit('message', send_msg)
        })
        .catch((err)=>console.log(err))
    })

    socket.on('disconnect', ()=>{
        let tempRoomId = ''
        // First get the room id of the user being deleted
        findUserBySocketId(socket.id)
        .then((user) => {
            tempRoomId = user.roomId
            // Delete the user
            return deleteBySocketId(socket.id)
        })
        .then(() => {return roomUsers(tempRoomId)})
        // Send the updated list of users to the room that user was in
        .then((usersList) => {
            io.to(tempRoomId).emit('roomUsers', {
                roomId: tempRoomId,
                usersList: usersList
            })
        })
        .catch(err => console.log(err))
    });
});