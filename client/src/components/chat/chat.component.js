import ReactDOM from 'react-dom';
import React, { useState, useContext, useEffect, useHistory } from 'react';
import { Row, InputGroup, Button, Container, Card, FormControl} from 'react-bootstrap';
import ScrollToBottom from 'react-scroll-to-bottom';
import "bootstrap/dist/css/bootstrap.css"
import "./chat.css"
import Message from "../message/message.component"
import queryString from 'query-string';
import io from 'socket.io-client';
import axios from 'axios';


// let socket = io;

function Chat({ location, socket }){
    // const ENDPOINT = 'http://localhost:5000';

    const [roomId, setRoomName] = useState('');
    const [user, setUser] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const history = useHistory;

    //For joining
    useEffect(() => {
        const { roomId, username } = queryString.parse(location.search)
        
        setRoomName(roomId)
        setUser(username)

        // socket = io(ENDPOINT);

        socket.emit('join', ({ roomId, username }))

        // This is called when the user leaves the page
        return () => {
            socket.emit('disconnect')
            socket.off()
        }
    }, [location.search])//[ENDPOINT, location.search])

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
            console.log('test')
        })
    }, [])
    
    const sendMessage = (event) => {
        event.preventDefault();
        if(message) {
          socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return(
        <Container fluid="sm" className="my-4 chatContainer">
            <Card className="wholeChat">
                <Card.Header className="text-center">Wait Room: {roomId}</Card.Header>
                <Container className="chatArea">
                <ScrollToBottom>
                    {messages.map((text)=>
                        <Message name={text.name} message={text.message} />
                    )}
                </ScrollToBottom>
                
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

