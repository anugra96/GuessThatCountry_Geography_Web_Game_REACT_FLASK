import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import Select from 'react-select'
import {names} from "./country_names";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import { Button, Container, Row, Col } from 'react-bootstrap';

function get_random_country() {
    var random_country = names[Math.floor(Math.random()*names.length)];
    return random_country;
}

const country_names = names;

const arr_of_guesses = [];

const make_guess_str = "/make_guess/";
const random_country_url = "/random_country/";

const random_country = get_random_country();

function RandomCountry() {
    const [randomCountry, setRandomCountry] = useState(random_country.value);

    var fetch_url = random_country_url.concat(randomCountry);
    
    useEffect(() => {

        fetch(fetch_url).then(res => res.json()).then(data => {
            // console.log(data.random_country);
        })});

    return <WebPage />

};


function WebPage() {
    const name = "Anugra Shah";
    const [country, setCountry] = useState({
        value: "",
        label: ""
    });
    const [destination, setDestination] = useState(random_country.value);
    const [guess_list, setGuesses] = useState(arr_of_guesses);
    const [guesses_number, setGuessesNumber] = useState(1)
    const [guessResponse, setGuessResponse] = useState({});

    

    var fetch_country;
    // make variable that fetches distance from flask api

    // useEffect(() => {
    //     fetch(fetch_country).then(res => res.json()).then(data => {
    //       setGuessResponse(data.response);
    //     });
    // }, []);


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

        <Container>
            <Row>
                <section>
                    <header>
                        <h1>Hello {name}, Welcome to Worldle </h1>
                    </header>
                    {/* <h2>DESTINATION: {destination}</h2> */}
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

            </Row>
            <Row>
                <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100wh' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                </MapContainer>


            </Row>
        </Container>




  
    </>
}


ReactDOM.render(<RandomCountry />, document.getElementById("root"));