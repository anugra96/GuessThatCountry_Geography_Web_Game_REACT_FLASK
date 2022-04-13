import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import Select from 'react-select'
import { LatLng } from "leaflet";
import {names} from "./country_names";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import CountryMap from "./map";
import "leaflet/dist/leaflet.css";
// import country_geojson from "./countries.js";

import { Button, Container, Row, Col } from 'react-bootstrap';

// function get_random_country() {
//     var random_country = names[Math.floor(Math.random()*names.length)];
//     return random_country;
// }

const country_names = names;

const arr_of_guesses = [];

const make_guess_str = "/make_guess/";
// const random_country_url = "/random_country/";

// const random_country = get_random_country();

// function RandomCountry(props) {
//     const [randomCountry, setRandomCountry] = useState(random_country.value);
//     const [centroid, setCentroid] = useState([])
//     const home_country = props.home_country;

//     var fetch_url = random_country_url.concat(randomCountry);

//     // const fetchData = useCallback(
//     //     () => {
//     //         fetch(fetch_url).then(res => res.json()).then(data => {
//     //             console.log(data.response.random_country_centroid);
//     //             setCentroid(data.response.random_country_centroid);
//     //         },
//     //     [fetch_url = random_country_url.concat(randomCountry)],
    
//     // )});

    
    
//     useEffect(() => {

//         fetch(fetch_url).then(res => res.json()).then(data => {
//             setCentroid(data.random_country_centroid);
//             console.log(data.random_country_centroid);
//         })});

//     return <>
//         <WebPage home_country={home_country} center={centroid}/>
//     </>
    
    
    

// }


function WebPage(props) {
    const name = "Anugra Shah";
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
                // var new_center = [data.response.centroid[0], data.response.centroid[1]]
                // console.log(new_center);
                // setCentroid(new_center);
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
            
            </Col>

            <Col>
                <CountryMap rand_dest={destination} centroid={[20,100]}/>   
            </Col>




                
            </Row>
                



        </Container>



  
    </>
}


// Exporting the component
export default WebPage;