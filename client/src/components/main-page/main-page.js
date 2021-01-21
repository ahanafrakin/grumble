import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
// import './main-page.styles.css'
import "bootstrap/dist/css/bootstrap.css"
import { Form, Button, Container, Row, Column, Card } from "react-bootstrap"

function MainPage() {
    const ENDPOINT = "http://localhost:5000"
    const history = useHistory()
    const [gameId, setGameId] = useState('')
    const [username, setUsername] = useState('')
    const [errorGameId, setErrorGameId] = useState('')
    const [errorUsername, setErrorUsername] = useState('')
    const [validGameId, setValidGameId] = useState(false)
    const [validGameUser, setValidGameUser] = useState(false)
    

    const onJoinGame = (event) => {
        if(!gameId || !username){
            event.preventDefault()
            gameId ? setErrorGameId(''):setErrorGameId('Please enter a valid Game Id')
            username ? setErrorUsername(''):setErrorUsername("Please enter a valid username")
        }
        if(validGameId != true){
            event.preventDefault()
            setErrorGameId('That game is currently not active.')
            setErrorUsername('')
        }
        if(validGameUser != true && validGameId){
            event.preventDefault()
            setErrorGameId('')
            setErrorUsername('That username is already taken.')
        }
    }

    useEffect(() => {
        axios.get(`${ENDPOINT}/rooms/${gameId}/room_available`)
            .then((res) => {
                if(res.data.Status == true){
                    setValidGameId(true)

                }
            })
            .catch((error) => {
                setValidGameId(false)
            })
    }, [gameId])

    useEffect(() => {
        if(validGameId){
            axios.get(`${ENDPOINT}/rooms/${gameId}/user_available`, {params: {"username": username}})
                .then((res) => {
                    if(res.data.Status == true){
                        setValidGameUser(true)
                    }
                    else{
                        setValidGameUser(false)
                    }
                })
        }
    }, [username])

    return(
    <Container fluid="sm" className="my-4">
        <Card bg="dark" text="light">
            <Card.Header className="text-center">Join An Existing Game</Card.Header>
            <Form className="text-center">
                <Form.Group controlId="formGameId">
                    <Form.Label>Game ID</Form.Label>
                    <Form.Text>{errorGameId}</Form.Text>
                    <Row className="justify-content-center">
                        <Form.Control className="mx-2 w-75" type="input" placeholder="Enter Game ID"
                        onChange={(event) => setGameId(event.target.value)}/>
                    </Row>
                </Form.Group>
                <Form.Group controlId="formName">
                    <Form.Label>Username</Form.Label>
                    <Form.Text>{errorUsername}</Form.Text>
                    <Row className="justify-content-center">
                        <Form.Control className="mx-2 w-75" type="input" placeholder="Username" 
                        onChange={(event) => setUsername(event.target.value)}/>
                    </Row>
                    <Row className="justify-content-center my-4">
                        <Link to={`/waitpage?roomId=${gameId}&username=${username}`} onClick={(event) => onJoinGame(event)}>
                            <Button>Join Game</Button>
                        </Link>
                    </Row>
                </Form.Group>
            </Form>
        </Card>
        <Card bg="dark" text="light" className="my-3">
            <Card.Header className="text-center">Create your own game</Card.Header>
            <Row className="justify-content-center my-4">
                <Link to={`/creategame`}>
                    <Button>Create Game</Button>
                </Link>
            </Row>
        </Card>
    </Container>
    )
}

export default MainPage