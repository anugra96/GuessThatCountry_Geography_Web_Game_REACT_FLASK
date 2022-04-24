import React, { useState, useEffect, useCallback } from "react";
import {createRoot} from 'react-dom/client';
import {names} from "./Data/country_names";
import WebPage from "./Components/start_game";
import "leaflet/dist/leaflet.css";
import "./Styles/MyMap.css";
import { StartGameContext } from "./Contexts/StartGameContext";

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

        })}, []);

    return <>
        <StartGameContext.Provider value={{ randomCountry}}>
            <WebPage />
        </StartGameContext.Provider>
        
    </>
}

root.render(<RandomCountry />);