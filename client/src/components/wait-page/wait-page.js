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



function WaitPage({ location, socket }) {
    const { roomId, username } = queryString.parse(location.search)
    const [users, setUsers] = useState([])

    return(
    <Container className="content" fluid="sm">
        <Row className="justify-content-md-center">
            <Col md="auto"><Chat location={location} socket={socket} setUsers={setUsers}/></Col>
            <Col md="auto"><UsersList users={users}/></Col>
        </Row>
        
        <Row className="justify-content-center">
            <Link  to={`/searchSpot?=${roomId}`}>
                <Button>Click to Start</Button>
            </Link>
        </Row>
    </Container>
    )
}

export default WaitPage