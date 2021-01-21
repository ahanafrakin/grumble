import ReactDOM from 'react-dom';
import React, { useState, useContext, useEffect, useHistory } from 'react';
import { Row, Col, InputGroup, Button, Container, Card, FormControl} from 'react-bootstrap';
import ScrollToBottom from 'react-scroll-to-bottom';
import "bootstrap/dist/css/bootstrap.css"
import "./usersList.css"
import Messages from "../message/message"
import queryString from 'query-string';
import io from 'socket.io-client';
import axios from 'axios';

function UsersList({ users }){

    return(
        <Container fluid="sm" className="my-4 listContainer" >
            <Card bg="dark" text="light" className="listCard">
                <Card.Header>Active Users</Card.Header>
                <Container>
                    {users.map((user) => (
                        <div>{user}</div>
                        ))}
                </Container>
            </Card>  
        </Container>
    )
}

export default UsersList

