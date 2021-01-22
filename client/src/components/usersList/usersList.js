import React from 'react';
import { Container, Card } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css"
import "./usersList.css"

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

