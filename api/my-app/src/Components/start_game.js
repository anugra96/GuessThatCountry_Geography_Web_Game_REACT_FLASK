import React, { useState, useEffect, useCallback, useContext } from "react";
import Select from 'react-select'
import {names} from "../Data/country_names";
import {MemoizedCountryMap} from "./map";
import "leaflet/dist/leaflet.css";
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
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
import ResultsMap from "./results_animation";
import { StartGameContext } from "../Contexts/StartGameContext";
import { GuessContext } from "../Contexts/GuessContext";



const country_names = names;

const arr_of_guesses = [];

const make_guess_str = "/make_guess/";


function WebPage() {
    const {randomCountry} = useContext(StartGameContext);
    const [country, setCountry] = useState({
        value: "",
        label: ""
    });
    const [destination, setDestination] = useState(randomCountry);
    const [guess_list, setGuesses] = useState(arr_of_guesses);
    const [guesses_number, setGuessesNumber] = useState(1)
    const [guessResponse, setGuessResponse] = useState({});
    const [resultsButton, setResultsButton] = useState(0);
    



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


    function results_button_handler() {
        setResultsButton(1);
    }

    return <>
    <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
            <Navbar.Brand href="#home">
                <img
                    alt="img"
                    src="/globe_white.png"
                    width="35"
                    height="35"
                    className="d-inline-block align-top" />
                Worldle by Anugra Shah
            </Navbar.Brand>
            <Nav.Link href="https://github.com/anugra96/Worldle_ReactFlask_WebApp" target={"_blank"}>Code</Nav.Link>

        </Container>
    </Navbar>

{/* 
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#link">Link</Nav.Link>
        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse> */}

    {!!(resultsButton === 0) &&
        <>
        {/* if they still have guesses left and haven't gotten it right */}
        {!!((guesses_number < 6) & (guessResponse.distance !== 0)) &&
            <>
            <Container>
                <Row className="pt-2">

                    <Col>
                        <MemoizedCountryMap rand_dest={destination} />
                    </Col>

                    <Col md lg="4">
                        <h3>Guesses left: {6 - guesses_number}</h3>
                        <Select
                            options={country_names}
                            onChange={setCountry}
                            style={{ zIndex: 9 }} />
                        <button onClick={fetchData}>
                            Confirm Guess
                        </button>

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
                                        }} src={get_arrow(d.bearing)} /></td>
                                    </tr>))}
                            </tbody>
                        </table>

                    </Col>

                </Row>
            </Container>

            </>
        }
        
        {/* if they guessed the right country, then: */}
        {!!(guessResponse.distance == 0) && 
            <>

                <Container>
                    <Row className="pt-2">

                        <Col>

                            <MemoizedCountryMap rand_dest={destination} />

                        </Col>


                        <Col md lg="4">

                            <p>CONGRATULATIONS! YOU GOT IT.</p>

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
                                            }} src={get_arrow(d.bearing)} /></td>
                                        </tr>))}
                                </tbody>
                            </table>

                            <button onClick={results_button_handler}>
                                See Results Animation
                            </button>

                        </Col>

                    </Row>
                </Container>
            
            
            </>
        }

        {/* if they have run out of guesses */}
        {!!((guesses_number === 6) & (guessResponse.distance !== 0)) &&
            <>

                <Container>
                    <Row className="pt-2">

                        <Col>

                            <MemoizedCountryMap rand_dest={destination} />

                        </Col>

                        <Col md lg="4">
                            <p>You are out of guesses. The answer was: {destination}</p>

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
                                            }} src={get_arrow(d.bearing)} /></td>
                                        </tr>))}
                                </tbody>
                            </table>

                            <button onClick={results_button_handler}>
                                See Results Animation
                            </button>

                        </Col>

                    </Row>

                </Container>

            </>
        }
        
        </>
    }

    {!!(resultsButton === 1) &&
        <>
            <GuessContext.Provider value={{guess_list, destination}} >
                <ResultsMap />
            </GuessContext.Provider>
        </>
    }

    







    </>
}


// Exporting the component
export default WebPage;