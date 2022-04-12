import React, { useState, useEffect, useCallback, useRef, onEachFeature } from "react";
import ReactDOM from "react-dom";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import { Button, Container, Row, Col } from 'react-bootstrap';
import mapData from "./countries.json";
import { LatLng } from "leaflet";

function MyMap(props) {


    function get_country(){
        var random_country = props.rand_dest;
        var counter = 1;
        var i = 0
        var final_country;
        while(counter) {
            var arr = mapData.features;
            if (arr[i].properties.ADMIN === random_country) {
                final_country = arr[i];
                counter = 0;
                break;
            } else {
                i = i + 1;
            }
            
        };
        return [final_country];
    }



    return <>
    
    <div>
        <h1 style={{ textAlign: "center" }}>
            My Map
        </h1>
        <MapContainer style={{ height: "80vh"}} zoom={2} center={props.centroid}>
            // takes an array of country features
            // YOU CAN FILTER AND PASS THE RANDOM COUNTRY THROUGH HERE
            <GeoJSON data={get_country()}>
                
            </GeoJSON>
        </MapContainer>
    </div>
    

    </>




};

// Exporting the component
export default MyMap;