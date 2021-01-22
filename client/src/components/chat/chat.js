import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { InputGroup, Button, Container, Card, FormControl} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css"
import "./chat.css"
import Messages from "../message/message"
import queryString from 'query-string';

function Chat({ location, socketRef, setUsers }){
    const history = useHistory()
    const [roomId, setRoomName] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    //For joining
    useEffect(() => {
        const { roomId, username } = queryString.parse(location.search)
        
        setRoomName(roomId)

        socketRef.current.emit('join', ({ roomId, username }))

        // This is called when the user leaves the page
        return () => {
            socketRef.current.emit('disconnect')
            socketRef.current.off()
        }
    }, [location.search])

    //For sending messages
    useEffect(()=>{
        socketRef.current.on('message', (receivedMessage)=>{
            //Add message from server to the messages list
            let addedMessage = {name: receivedMessage.user, message: receivedMessage.message}
            setMessages(messages => [...messages, addedMessage])
        })

        socketRef.current.on('receivedStart', (receivedStart) => {
            const { roomId, username } = queryString.parse(location.search)
            history.push(`/searchpage?roomId=${roomId}&username=${username}`)
        })

        socketRef.current.on('setSessionAcknowledgement', (sessionId) => {
            sessionStorage.setItem('sessionId', sessionId)
        })

        socketRef.current.on('roomUsers', (receivedUsers)=>{

            setUsers(receivedUsers.usersList)
        })
    }, [])
    
    const sendMessage = (event) => {
        event.preventDefault();
        if(message) {
            socketRef.current.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return(
        <Container fluid="sm" className="my-4 chatContainer">
            <Card bg="dark" text="light" className="wholeChat">
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

