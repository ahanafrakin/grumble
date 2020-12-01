//Need to do imports like this because we're in JS environment, not react
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const http = require('http');
const axios = require('axios');
require('dotenv').config();
const { addUser } = require("./routes/rooms")

//TODO: Figure out how to change env variables (I think its in package.json)
const PORT = process.env.PORT || 5000

const router = require('./routes/router');

//Mongodb Connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log("MongooseDB database established successfully");
})

const BACKENDLINK = "http://localhost:5000"
const { callbackify } = require('util');
const app = express();
const server = http.createServer(app);
app.use(cors())
app.use(router);
app.use(express.json());
// const io = socketio(server);

const roomsRouter = require('./routes/rooms');
const usersRouter = require('./routes/users');

//When user goes to /room, it would load what's in roomsRouter
app.use('/rooms', roomsRouter);
app.use('/users', usersRouter);

server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`));
const io = socketio.listen(server);
io.origins('*:*')

io.on('connection', (socket) => {
    console.log('We have a new connection');

    socket.on('join', ({ roomId, username }) =>{
        axios.put(`${BACKENDLINK}/rooms/${roomId}/add_user`,{
            "username": username, 
            "roomId": roomId,
            "socketId": socket.id})
            .catch(err=>console.log(err))

        socket.join(roomId)
        
        socket.emit('message', {user: 'admin', text: `${username} welcome to the room ${roomId}`})
        socket.broadcast.to(roomId).emit('message', {user: 'admin', text: `${username} has joined.`})

        axios.get(`${BACKENDLINK}/rooms/${roomId}/users`)
        .then(result=>{
            io.to(roomId).emit('roomUsers', {
                roomId: roomId,
                username: result.data.users
            })
        })
        .catch(err=>console.log(err))
        
           
    });

    socket.on('sendMessage', (message)=>{
        //We have the id from the socket that sent the message
        axios.get(`${BACKENDLINK}/users/find_user_by_socketid/${socket.id}`)
        .then(user=>{
            send_msg = {
                name: user.data.username,
                message: message
            }
            io.to(user.data.roomId).emit('message', send_msg)
        })
    })

    socket.on('disconnect', ()=>{
        console.log(socket.id)
        axios.delete(`${BACKENDLINK}/users/delete_by_socketid/${socket.id}`)
        .catch(err=>console.log(err))
        console.log('User has left')
    });
});