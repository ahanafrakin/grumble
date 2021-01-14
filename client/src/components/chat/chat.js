import ReactDOM from 'react-dom';
import React, { useState, useContext, useEffect, useHistory } from 'react';
import { Row, Col, InputGroup, Button, Container, Card, FormControl} from 'react-bootstrap';
import ScrollToBottom from 'react-scroll-to-bottom';
import "bootstrap/dist/css/bootstrap.css"
import "./chat.css"
import Messages from "../message/message"
import queryString from 'query-string';
import io from 'socket.io-client';
import axios from 'axios';

function Chat({ location, socket, setUsers }){

    const [roomId, setRoomName] = useState('');
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const ENDPOINT = 'http://localhost:5000';
    //For joining
    useEffect(() => {
        socket = io.connect((ENDPOINT))
        const { roomId, username } = queryString.parse(location.search)
        
        setRoomName(roomId)
        setUser(username)

        socket.emit('join', ({ roomId, username }))

        // This is called when the user leaves the page
        return () => {
            socket.emit('disconnect')
            socket.off()
        }
    }, [ENDPOINT,location.search])

    //For sending messages
    useEffect(()=>{
        socket.on('message', (receivedMessage)=>{
            //Add message from server to the messages list
            console.log(receivedMessage)
            let addedMessage = {name: receivedMessage.user, message: receivedMessage.message}
            setMessages(messages => [...messages, addedMessage])
        })

        socket.on('receivedStart', (receivedStart) => {

        })

        socket.on('setSessionAcknowledgement', (sessionId) => {
            sessionStorage.setItem('sessionId', sessionId)
        })

        socket.on('roomUsers', (receivedUsers)=>{
            console.log(receivedUsers.usersList)
            setUsers(receivedUsers.usersList)
        })
    }, [])
    
    const sendMessage = (event) => {
        event.preventDefault();
        if(message) {
          console.log(socket)
          socket.emit('sendMessage', message, () => {setMessage('')});
        }
    }

    return(
        <Container fluid="sm" className="my-4 chatContainer">
            <Card className="wholeChat">
                <Card.Header className="text-center">Wait Room: {roomId}</Card.Header>
                <Container className="chatArea">
                    <Messages messages={messages}/>
                </Container>
                <Card.Footer>
                    <InputGroup className="mb-3">
                        <FormControl
                        placeholder="Type a message..."
                        aria-label="Send Message"
                        onChange={(event) => setMessage(event.target.value)}/>
                        <InputGroup.Append>
                            <Button variant="primary" onClick={(e) => sendMessage(e)}>Send</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Card.Footer>
            </Card>  
        </Container>
    )
}

export default Chat
