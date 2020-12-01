import ReactDOM from 'react-dom';
import React from 'react';
import { Container, Card } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import "./message.css"


function Message({name, message}){
    return(
        <Card className="message">
            <Container className="message-name">{name}</Container>
            <Container className="message-text">{message}</Container>
        </Card>
    )
}

export default Message
