import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Row, Column, Card, DropdownButton, Dropdown } from "react-bootstrap"
import Map from "../map/map"
import "./create-page.css"

function CreatePage() {
    const history = useHistory()
    const [location, setLocation] = useState('')
    const [activities, setActivities] = useState('')
    //For now, later we will store this in mongodb and generate automatically
    const [username, setUsername] = useState('');
    const [numPlaces, setNumPlaces] = useState('');
    const [radius, setRadius] = useState(10);
    const redirect_to_search = useState('')

    // Error checking states
    const [errorUsername, setErrorUsername] = useState('');
    const [errorActivities, setErrorActivities] = useState('')
    const [errorLocation, setErrorLocation] = useState('')
    const [errorNumPlaces, setErrorNumPlaces] = useState('');
    const [errorRadius, setErrorRadius] = useState('');

    let roomId = ""

    const onSubmit = (event) => {
        if (!username || !activities || !location || !numPlaces || !radius){
            event.preventDefault()
            username ? setErrorUsername(''):setErrorUsername("Please enter a valid username")
            activities? setErrorActivities(''):setErrorActivities("Please enter some activities seperated by commas")
            location ? setErrorLocation(''):setErrorLocation("Please enter your location in the form City, Country")
            radius ? setErrorRadius(''):setErrorRadius("Please enter your search radius")
            numPlaces ? setErrorNumPlaces(''):setNumPlaces("Please enter your search radius")
            console.log(username, activities, location, radius, numPlaces)
        }
        else{
            axios.post('http://localhost:5000/rooms/create_room',
            {
                lat: location.lat,
                lng: location.lng,
                radius: radius,
                numPlaces: numPlaces,
                searchTerms: activities,
            })
                .then((res) => {
                    console.log(res.data)
                    roomId = res.data.roomId
                    history.push(`/waitpage?roomId=${roomId}&username=${username}`)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    return(
    <Container fluid="sm" className="my-4">
        <Card bg="dark" text="light">
            <Card.Header className="text-center">Create A New Session</Card.Header>
            <Form className="text-center">
                <Form.Group className="mt-2" controlId="formActivities">
                    <Form.Label>Activities</Form.Label>
                    <Form.Text>{errorActivities}</Form.Text>
                    <Row className="justify-content-center">
                        <Form.Control className="mx-2 w-75" type="input" placeholder="Enter activities seperated by commas"
                        onChange={(event) => setActivities(event.target.value)}/>
                    </Row>
                </Form.Group>
                <Form.Group className="mt-2" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Text>{errorUsername}</Form.Text>
                    <Row className="justify-content-center">
                        <Form.Control className="mx-2 w-75" type="input" placeholder="Enter your username"
                        onChange={(event) => setUsername(event.target.value)}/>
                    </Row>
                </Form.Group>
                <Form.Group controlId="formNumberOfPlaces">
                    <Form.Label>Select the number of places to choose from</Form.Label>
                    <Row className="justify-content-center">
                        <Form.Control className="mx-2 w-75" type="input" placeholder="Number of places up to 10"
                        onChange={(event) => setNumPlaces(event.target.value)}/>
                    </Row>
                </Form.Group>
                <Form.Group controlId="formRadius">
                    <Form.Label>Select search radius</Form.Label>
                    <Row className="justify-content-center">
                        <Form.Control className="mx-2 w-75" type="input" placeholder="Search radius"
                        onChange={(event) => setRadius(parseInt(event.target.value))}/>
                    </Row>
                </Form.Group>
                <Form.Group controlId="formLocation" className="mapStyle">
                    <Form.Label>Please select your location on the map</Form.Label>
                    {/* <Row className="mx-2 w-75 justify-content-center mapStyle"> */}
                        <Map style={{alignContent: "center"}} setLocation={setLocation}/>
                    {/* </Row> */}
                </Form.Group>
                <Button onClick={onSubmit} className="my-2">Create Game</Button>
            </Form>
        </Card>
    </Container>
    )
}

export default CreatePage