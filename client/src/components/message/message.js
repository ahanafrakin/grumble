import React, {useEffect, useRef} from 'react';
import { Container, Card } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import "./message.css"


function Messages({messages}){
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

  useEffect(scrollToBottom, [messages]);
    return(
        <div>
            {messages.map((text)=>(
                <Card bg="dark" text="light" className="message">
                    <Container className="message-name">{text.name}</Container>
                    <Container className="message-text">{text.message}</Container>
                </Card>
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default Messages
