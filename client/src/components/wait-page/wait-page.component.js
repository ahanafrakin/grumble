import React, { useState, useContext, useEffect, useHistory } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Row, InputGroup, Button, Container } from 'react-bootstrap';
import Chat from '../chat/chat.component'

let socket = io;

function WaitPage({ location }) {
    const ENDPOINT = 'http://localhost:5000';

    const { roomId, username } = queryString.parse(location.search)

    return(
    <Container style={{height: "100vh"}} fluid="sm" className="my-4">
        <Chat location={location} />
        <Row className="justify-content-center">
            <Link  to={`/searchSpot?=${roomId}`}>
                <Button>Click to Start</Button>
            </Link>
        </Row>
        
    </Container>
    )
}

export default WaitPage