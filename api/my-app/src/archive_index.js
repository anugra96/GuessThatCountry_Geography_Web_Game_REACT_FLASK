import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Select from 'react-select'
import {names} from "./country_names";

function get_random_country() {
    var random_country = names[Math.floor(Math.random()*names.length)];
    return random_country;
}

// ?country=some-value

// ?id1=123&id2=abc

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ];

const country_names = names;

const arr_of_guesses = [];

const make_guess_str = "/make_guess/?country=";

const random_country = get_random_country();

function SetHomeCountry() {
    const [homeCountry, setHomeCountry] = useState("Canada");

    return <>
        <Select
            options={country_names}
            onChange={setHomeCountry} />
        <WebPage homeCountry/>
    </>
}


function WebPage(props) {
    const name = "Anugra Shah";
    const [country, setCountry] = useState({
        value: "first",
        label: "first"
    });
    const [destination, setDestination] = useState(random_country.value);
    const [guess_list, setGuesses] = useState(arr_of_guesses);
    const [guesses_number, setGuessesNumber] = useState(1)
    const [currentTime, setCurrentTime] = useState(0);
    const [guessResponse, setGuessResponse] = useState();
    


    

    var fetch_country = country.value.concat("?").concat("destination=").concat(destination);
    var full_fetch_url = make_guess_str.concat(fetch_country);


    

    useEffect(() => {
        fetch(full_fetch_url).then(res => res.json()).then(data => {
            setGuessResponse(data.response);
        })});



    function add_guess() {
        // make variable that fetches distance from flask api
        // make variable that fetches direction from flask api
        setGuessesNumber(guesses_number + 1);
        setGuesses(guess_list.concat(
            {
                guess_no: guesses_number,
                guessed_country: country.value,
                distance: guessResponse.distance,
                bearing: guessResponse.direction,
                destination: destination
            }
        ))
    };


    return <>
        <section>
            <header>
                <h1>Hello {name}, Welcome to Worldle </h1>
                <p>The current time is {currentTime}.</p>
            </header>
            <h2>DESTINATION: {destination}</h2>
        </section>
        <h2>Guess Country:</h2>



        {guesses_number === 6 &&
            <p> SORRY YOU'RE OUT OF GUESSES. YOU'RE TRASH. THE ANSWER WAS {destination}</p>
        }

        {/* {guessResponse.distance === 0 &&
            <p>CONGRATULATIONS! YOU GOT IT.</p>
        } */}

        {guesses_number < 6 &&
                <><Select
                options={country_names}
                onChange={setCountry} /><p>You Selected: {country.value}</p><button onClick={() => add_guess()}>
                    Confirm Guess
                </button><table>
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
                </table></>
        }
  
    </>
}


ReactDOM.render(<SetHomeCountry />, document.getElementById("root"));