import React, { useState, useEffect, useCallback, useRef, onEachFeature } from "react";
import ReactDOM from "react-dom";
import { MapContainer, GeoJSON, MapConsumer } from 'react-leaflet'
import mapData from "../Data/countries.json";
import CountryCenters from  "../Data/new_mini.json";
import area from '@turf/area';


function CountryMap(props) {


    function set_zoom(){
        var random_country = props.rand_dest;
        var counter = 1;
        var i = 0
        var temp_area;
        var zoom_level;
        while(counter) {
            var arr = CountryCenters.features;
            if (arr[i].properties.ADMIN === random_country) {
                temp_area = area(arr[i])/1000000;
                counter = 0;
                break;
            } else {
                i = i + 1;
            }
            
        };


        if (temp_area < 5000) {
            zoom_level = 8.5;
        }
        else if ((temp_area > 5000) && (temp_area < 100000)) {
            zoom_level = 7; 
        } else if ((temp_area > 100000) && (temp_area < 250000)) {
            zoom_level = 5.5;
        } else if ((temp_area > 250000) && (temp_area < 750000)) {
            zoom_level = 4.5
        } else {
            zoom_level = 3.5;
        }

    
        return zoom_level;
    }


    function get_country_center(){
        var random_country = props.rand_dest;
        var counter = 1;
        var i = 0
        var final_country_center;
        var temp_area;
        while(counter) {
            var arr = CountryCenters.features;
            if (arr[i].properties.ADMIN === random_country) {
                final_country_center = arr[i].properties.centroid;
                temp_area = area(arr[i])/1000000;
                counter = 0;
                break;
            } else {
                i = i + 1;
            }
            
        };

        const center_obj = {
            "lat": final_country_center[0],
            "lon": final_country_center[1],
            "area": temp_area
        };
        console.log(temp_area);
        return center_obj;
    }

    function OnEachCountry (country, layer) {

        const countryName = country.properties.ADMIN;

        if (props.rand_dest === countryName) {
            layer.setStyle(
                {
                    color: "white",
                    fillColor: "green",
                    Weight: 0,
                }
            )
        } else {
            layer.setStyle(
                {
                    color: "white",
                    fillOpacity: 0,
                    opacity: 0,
                    Weight: 0,
                }
            )
        }

    }


    return <>

        <MapContainer style={{ height: "40vh"} } zoom={set_zoom() } center={get_country_center()} zoomControl={false} >
            {/* takes an array of country features */}
            {/* YOU CAN FILTER AND PASS THE RANDOM COUNTRY THROUGH HERE */}
            <GeoJSON data={mapData.features} onEachFeature={OnEachCountry}/>
            <MapConsumer>
                {(map) => {
                    map.flyTo(get_country_center(), set_zoom());
                }}
            </MapConsumer>
        </MapContainer>



    </>




};

// Exporting the component

export const MemoizedCountryMap = React.memo(CountryMap);