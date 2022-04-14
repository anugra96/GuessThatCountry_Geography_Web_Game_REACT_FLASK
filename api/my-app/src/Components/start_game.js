import React, { useState, useEffect, useCallback } from "react";
import Select from 'react-select'
import {names} from "../Data/country_names";
import {MemoizedCountryMap} from "./map";
import "leaflet/dist/leaflet.css";
import { Container, Row, Col } from 'react-bootstrap';
import N from '../arrows/N.png';
import S from '../arrows/S.png';
import E from '../arrows/E.png';
import W from '../arrows/W.png';
import NW from '../arrows/NW.png';
import NNW from '../arrows/NNW.png';
import WNW from '../arrows/WNW.png';
import NE from '../arrows/NE.png';
import NNE from '../arrows/NNE.png';
import ENE from '../arrows/ENE.png';
import SW from '../arrows/SW.png';
import SSW from '../arrows/SSW.png';
import WSW from '../arrows/WSW.png';
import SE from '../arrows/SE.png';
import SSE from '../arrows/SSE.png';
import ESE from '../arrows/ESE.png';

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

    function get_arrow(query_direction) {
        if (query_direction === "N") {
            return N;
        } else if (query_direction === "S") {
            return S;
        } else if (query_direction === "E") {
            return E;
        } else if (query_direction === "W") {
            return W;
        } else if (query_direction === "NW") {
            return NW;
        } else if (query_direction === "NNW") {
            return NNW;
        } else if (query_direction === "WNW") {
            return WNW;
        } else if (query_direction === "NE") {
            return NE;
        } else if (query_direction === "NNE") {
            return NNE;
        } else if (query_direction === "ENE") {
            return ENE;
        } else if (query_direction === "SW") {
            return SW;
        } else if (query_direction === "SSW") {
            return SSW;
        } else if (query_direction === "WSW") {
            return WSW;
        } else if (query_direction === "SE") {
            return SE;
        } else if (query_direction === "SSE") {
            return SSE;
        } else if (query_direction === "ESE") {
            return ESE;
        } else {
            return N;
        }
    }

    return <>
    
    <Container fluid>
        <Row>
            <Col md lg="4">
                <section>
                        <header>
                            <h1>Welcome to Worldle.</h1>
                        </header>
                    </section>
                    <h2>Guess Country:</h2>

                    {!!(guessResponse.distance === 0) &&
                        <p>CONGRATULATIONS! YOU GOT IT.</p>
                        
                    }

                    {!!((guesses_number === 6) & (guessResponse.distance !== 0)) &&
                        <p> SORRY YOU'RE OUT OF GUESSES. YOU'RE TRASH. THE ANSWER WAS {destination}</p>
                    }


                    {!!((guesses_number < 6) & (guessResponse.distance !== 0)) &&
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
                                <tbody>
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
                                            <td><img style={{
                                                width: 20,
                                                height: 20,
                                            }}src={get_arrow(d.bearing)} /></td>
                                        </tr>))}
                                </tbody>
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