import React, { useState } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import Chat from '../chat/chat'
import UsersList from '../usersList/usersList'
import "./wait-page.css"



function WaitPage({ location, socketRef }) {
    const [users, setUsers] = useState([])

    const redirectSearch = () => {
        socketRef.current.emit("startSearch")
    }

    return(
    <Container className="content" fluid="sm">
        <Row className="justify-content-md-center">
            <Col md="auto"><Chat location={location} socketRef={socketRef} setUsers={setUsers}/></Col>
            <Col md="auto"><UsersList users={users}/></Col>
        </Row>
        
        <Row className="justify-content-center">
            <Button onClick={redirectSearch}>Click to Start</Button>
        </Row>
    </Container>
    )
}

export default WaitPage