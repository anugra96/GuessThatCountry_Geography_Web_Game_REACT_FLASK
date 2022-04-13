import React, { useState, useEffect, useCallback, useRef, onEachFeature } from "react";
import ReactDOM from "react-dom";
import { MapContainer, GeoJSON, MapConsumer } from 'react-leaflet'
import mapData from "../Data/countries.json";
import CountryCenters from  "../Data/new_mini.json";


function GuessMap(props) {
    const [guess, setGuess] = useState(props.guess_country);
    const [guessList, setGuessList] = useState([props.guess_country]);

    function get_country_center(query_country){
        var counter = 1;
        var i = 0
        var final_country_center;
        while(counter) {
            var arr = CountryCenters.features;
            if (arr[i].properties.ADMIN === query_country) {
                final_country_center = arr[i].properties.centroid;
                counter = 0;
                break;
            } else {
                i = i + 1;
            }
            
        };

        const center_obj = {
            "lat": final_country_center[0],
            "lon": final_country_center[1]
        };
        return center_obj;
    }

    function OnEachCountry (country, layer) {

        const countryName = country.properties.ADMIN;
        

        if (props.guess_country === countryName) {
            layer.setStyle(
                {
                    color: "red",
                    fillOpacity: 100,
                    opacity: 0,
                }
            )
        } else {
            layer.setStyle(
                {
                    color: "white",
                    fillOpacity: 10,
                    opacity: 0,
                    Weight: 0.01,
                }
            )
        }

    }


    return <>

        <MapContainer 
            style={{ height: "100vh"}} 
            zoom={5} 
            center={get_country_center(props.guess_country)} 
            zoomControl={false} 
            dragging={false}
            doubleClickZoom={false}
            scrollWheelZoom={false} >
            {/* takes an array of country features */}
            {/* YOU CAN FILTER AND PASS THE RANDOM COUNTRY THROUGH HERE */}
            <GeoJSON data={mapData.features} onEachFeature={OnEachCountry}/>
            <MapConsumer>
                {(map) => {
                    map.flyTo(get_country_center(props.guess_country), 5);
                }}
            </MapConsumer>
        </MapContainer>



    </>




};

// Exporting the component

// export const MemoizedDestinationMap = React.memo(DestinationMap);
export default GuessMap;