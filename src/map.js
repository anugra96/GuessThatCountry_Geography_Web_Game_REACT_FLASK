import React, { useState, useEffect, useCallback, useRef, onEachFeature } from "react";
import ReactDOM from "react-dom";
import { MapContainer, GeoJSON, MapConsumer } from 'react-leaflet'
import mapData from "./countries.json";
import CountryCenters from  "./new_mini.json";


function CountryMap(props) {



    function get_country_center(){
        var random_country = props.rand_dest;
        var counter = 1;
        var i = 0
        var final_country_center;
        while(counter) {
            var arr = CountryCenters.features;
            if (arr[i].properties.ADMIN === random_country) {
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

        if (props.rand_dest === countryName) {
            layer.setStyle(
                {
                    color: "black",
                }
            )
        } else {
            layer.setStyle(
                {
                    color: "white",
                    fillOpacity: 0,
                    opacity: 0,
                }
            )
        }

    }


    return <>

        <MapContainer style={{ height: "100vh"}} zoom={2.5} center={[20,100]}>
            {/* takes an array of country features */}
            {/* YOU CAN FILTER AND PASS THE RANDOM COUNTRY THROUGH HERE */}
            <GeoJSON data={mapData.features} onEachFeature={OnEachCountry}/>
            <MapConsumer>
                {(map) => {
                    map.flyTo(get_country_center(), 4);
                }}
            </MapConsumer>
        </MapContainer>



    </>




};

// Exporting the component
export default CountryMap;