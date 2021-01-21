import React, { useState, useContext, useEffect, useHistory } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, InputGroup, Button, Container } from 'react-bootstrap';
import Chat from '../chat/chat'
import UsersList from '../usersList/usersList'
import "./wait-page.css"



function WaitPage({ location, socketRef }) {
    const { roomId, username } = queryString.parse(location.search)
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