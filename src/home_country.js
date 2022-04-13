import React, { useState, useEffect, useCallback, useRef, onEachFeature } from "react";
import ReactDOM from "react-dom";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import { Button, Container, Row, Col } from 'react-bootstrap';
import mapData from "./countries.json";
import { LatLng } from "leaflet";
import WebPage from "./start_game";

function AllCountryMap(props) {
    const [homeCountry, setHomeCountry] = useState("NONE");
    const random_country = props.rand_dest;

    const countryStyle = {
        fillColor: "red",
        fillOpacity: 0.9,
        color: "black",
        weight: 1,
    };


    function OnEachCountry (country, layer) {
        const countryName = country.properties.ADMIN;
        layer.bindPopup(countryName);

        layer.on({
            click: (event) => {
                event.target.setStyle(
                    {
                        color: "green",
                        fillColor: "blue",
                    }
                )


                setHomeCountry(countryName);
            }
        })

    }


    return <>

        {homeCountry !== "NONE" &&
            <WebPage home_country={homeCountry} rand_dest={random_country}/>
        }

        {homeCountry === "NONE" &&
            <MapContainer style={{ height: "100vh" }} zoom={2} center={[20, 100]}>
                {/* takes an array of country features */}
                {/* YOU CAN FILTER AND PASS THE RANDOM COUNTRY THROUGH HERE */}
                <GeoJSON style={countryStyle} data={mapData.features} onEachFeature={OnEachCountry} />
            </MapContainer>
        }





    </>




};

// Exporting the component
export default AllCountryMap;