import React, { useState, useEffect, useCallback } from "react";
import Select from 'react-select'
import {names} from "../Data/country_names";
import {MemoizedCountryMap} from "./map";
import "leaflet/dist/leaflet.css";


import { Container, Row, Col } from 'react-bootstrap';


const country_names = names;

const arr_of_guesses = [];

const make_guess_str = "/make_guess/";


function WebPage(props) {
    const [country, setCountry] = useState({
        value: props.home_country,
        label: props.home_country
    });
    const [destination, setDestination] = useState(props.rand_dest);
    const [guess_list, setGuesses] = useState(arr_of_guesses);
    const [guesses_number, setGuessesNumber] = useState(1)
    const [guessResponse, setGuessResponse] = useState({});



    var fetch_country;
    // make variable that fetches distance from flask api
    const fetchData = useCallback(
        () => {
            fetch(fetch_country).then(res => res.json()).then(data => {
                setGuessResponse(data.response);
                setGuessesNumber(guesses_number + 1);
                setGuesses(guess_list.concat(
                    {
                        guess_no: guesses_number,
                        guessed_country: country.value,
                        distance: data.response.distance,
                        bearing: data.response.direction,
                        destination: destination
                    }
                ))
            })
        },
        [fetch_country = make_guess_str.concat(country.value).concat("/").concat(destination)],
    );

    return <>
    
    <Container fluid>
        <Row>
            <Col md lg="4">
                <section>
                        <header>
                            <h1>Welcome to Worldle.</h1>
                            <h2>Your Home Country is: {props.home_country}</h2>
                        </header>
                    </section>
                    <h2>Guess Country:</h2>

                    {guessResponse.distance === 0 &&
                        <p>CONGRATULATIONS! YOU GOT IT.</p>
                        
                    }

                    {((guesses_number === 6) & (guessResponse.distance !== 0)) &&
                        <p> SORRY YOU'RE OUT OF GUESSES. YOU'RE TRASH. THE ANSWER WAS {destination}</p>
                    }


                    {((guesses_number < 6) & (guessResponse.distance !== 0)) &&
                        <><Select
                            options={country_names}
                            onChange={setCountry} /><p>You Selected: {country.value}</p>
                            <button onClick={fetchData}>
                                Confirm Guess
                            </button>
                        </>
                    }

                    {guessResponse !== {} &&
                        <>
                            <table>
                                <tr>
                                    <th>Guess Number</th>
                                    <th>Guessed Country</th>
                                    <th>Distance to Destination</th>
                                    <th>Direction to Destination</th>
                                </tr>
                                {guess_list.map(d => (
                                    <tr>
                                        <td>{d.guess_no}</td>
                                        <td>{d.guessed_country}</td>
                                        <td>{d.distance} km</td>
                                        <td>{d.bearing}</td>
                                    </tr>))}
                            </table>
                        </>
                    }
            
            </Col>

            <Col>
                <MemoizedCountryMap rand_dest={destination}/>   
            </Col>


            </Row>
                
        </Container>

    </>
}


// Exporting the component
export default WebPage;