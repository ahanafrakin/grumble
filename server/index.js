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
        addUser(username, roomId, socket.id).then(addUserRes => {
            console.log(`Successfully added ${username} to the room.`)
            socket.join(roomId)
        
            socket.emit('message', {user: adminUsername, message: `${username} welcome to the room ${roomId}`})
            socket.broadcast.to(roomId).emit('message', {user: adminUsername, message: `${username} has joined.`})

            roomUsers(roomId)
            .then( usersList => {
                io.to(roomId).emit('roomUsers', {
                    roomId: roomId,
                    username: usersList
                })
                console.log("Succesfuly sent list of users")
                console.log(usersList)
            })
            .catch(err => {console.log(`Failed to send list of users in room ${roomId}.`); console.log(err)}) 
        })
        .catch(err => console.log(`Failed to add ${username} to the room. The error is ${err}`))
    });

    socket.on('sendMessage', (message)=>{
        //We have the id from the socket that sent the message
        findUserBySocketId(socket.id)
        .then((queryResult) => {
            console.log(`Found that the user sending message is ${queryResult.username}`)
            send_msg = {
                user: queryResult.username,
                message: message
            }
            io.to(queryResult.roomId).emit('message', send_msg)
        })
        .catch(()=>console.log(`Failed to send message`))
    })

    socket.on('disconnect', ()=>{
        deleteBySocketId(socket.id)
        .then(test => console.log(`Successfully deleted user.`))
        .catch(err => console.log(err))
    });
});