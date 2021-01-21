import ReactDOM from 'react-dom';
import React, {useEffect, useState, useRef} from 'react';
import { Container, Card, Row, Col, Button } from "react-bootstrap"
import queryString from 'query-string';
import "bootstrap/dist/css/bootstrap.css"
import axios from 'axios';
import "./search-page.css"
import StarRatings from 'react-star-ratings';

function SearchPage({location, socketRef}){
    const ENDPOINT = 'http://localhost:5000';
    const [interests, setInterests] = useState([])
    const [cost, setCost] = useState(0);
    const [results, setResults] = useState(0);
    const accepted = useRef([])
    const declined = useRef([])
    const initiated = useRef()

    const googlePhotosLink = (photo_reference) => {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    }

    const clickedAccept = (event) => {
        event.preventDefault()
        accepted.current.push(interests[0].place_id)
        setInterests(interests.slice(1))
    }

    const clickedDecline = (event) => {
        event.preventDefault()
        declined.current.push(interests[0].place_id)
        setInterests(interests.slice(1))
    }

    useEffect(()=>{
        initiated.current = false
        accepted.current = []
        declined.current = []

        socketRef.current.emit("requestInterests", queryString.parse(location.search).roomId)

        socketRef.current.on("interestsList", (interestsList) => {
            setInterests(interestsList)
            initiated.current = true;
        })

        socketRef.current.on("searchResults", (result) => {
            console.log(result)
            setResults(result)
        })
    }, [])

    useEffect(()=>{
        if(initiated.current === true){
            if(interests.length === 0){
                // send message to backend saying done
                socketRef.current.emit("completedSearch", ({accepted, declined}))
            }
            else{
                if(interests[0].price_level == 1) setCost('$')
                else if(interests[0].price_level == 2) setCost('$$')
                else if(interests[0].price_level == 3) setCost('$$$')
                else setCost('$$$$')
            }
        }
    }, [interests])

    if(results !== 0){
        if(results === "all_declined"){
            return(
            <Container fluid="sm" className="my-4">
                <Card bg="dark" text="light" className="my-3">
                    <Card.Header className="text-center">Error</Card.Header>
                    <Row className="justify-content-center text-center my-4">
                        No one in the party accepted anything.<br/>
                        No suggestions could be made. Please try again.
                    </Row>
                </Card>
            </Container>
            )
        }
        else{
            return(
                <div>
                    <div className="lineContainer">
                        <span>Suggested Location</span>
                    </div>

                    <div className="suggestionContainer">
                        <img className="interestImage" src={googlePhotosLink(results.photos[0].photo_reference)}/>
                    </div>

                    <div className="lineContainer">
                        <span>{results.name}</span>
                    </div>
                    
                    <div className="lineContainer">
                        <span className="ratingNumeric">{`Rating: ${results.rating} `}</span>
                        <span className="ratingStars"><StarRatings rating={results.rating} starDimension="35px" starRatedColor="gold" numberOfStars={5} name='ratingStars'/></span>
                    </div>

                    <div className="lineContainer">
                        <span>{`Cost: ${cost} `}</span>
                    </div>

                    <div className="lineContainer">
                        <span>{`Address: ${results.vicinity} `}</span>
                    </div>
                </div>
            )
        }
    }
    else if(interests.length > 0){
        return(
            <div>
                <div className="interestContainer">
                    <img className="interestImage" src={googlePhotosLink(interests[0].photos[0].photo_reference)}/>
                </div>

                <div className="lineContainer">
                    <span>{interests[0].name}</span>
                </div>

                <div className="lineContainer">
                    <span className="ratingNumeric">{`Rating: ${interests[0].rating} `}</span>
                    <span className="ratingStars"><StarRatings rating={interests[0].rating} starDimension="35px" starRatedColor="gold" numberOfStars={5} name='ratingStars'/></span>
                </div>

                <div className="lineContainer">
                    <span>{`Cost: ${cost} `}</span>
                </div>
                
                <div className="lineContainer">
                    <div><Button className="button declineButton" onClick={clickedDecline}>X</Button></div>
                    <div><Button className="button acceptButton" onClick={clickedAccept}>✓</Button></div>
                </div>
            </div>
        )
    }
    else{
        return(
        <Container fluid="sm" className="my-4">
            <Card bg="dark" text="light" className="my-3">
                <Card.Header className="text-center">Completed</Card.Header>
                <Row className="justify-content-center text-center my-4">
                    You are done looking through suggestions!<br/>
                    Please wait until the rest of your party is completed.
                </Row>
            </Card>
        </Container>
        )
    }
}

export default SearchPage
