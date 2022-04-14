import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import {createRoot} from 'react-dom/client';
import {names} from "./Data/country_names";
import AllCountryMap from "./Components/home_country";
import WebPage from "./Components/start_game";
import "leaflet/dist/leaflet.css";
import "./Styles/MyMap.css";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);


function get_random_country() {
    var random_country = names[Math.floor(Math.random()*names.length)];
    return random_country;
}

const random_country_url = "/random_country/";

const random_country = get_random_country();

function RandomCountry() {
    const [randomCountry, setRandomCountry] = useState(random_country.value);
    var fetch_url = random_country_url.concat(randomCountry);
    useEffect(() => {

        fetch(fetch_url).then(res => res.json()).then(data => {

        })});

    return <>
        <HomePage random_country={randomCountry}/>
    </>
}


function HomePage(props) {
    const random_country_prop = props.random_country;
    return <>
        <WebPage rand_dest={random_country_prop} />
    </>
}


root.render(<RandomCountry />);