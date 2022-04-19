import React, { useState, useEffect, useCallback, useRef, onEachFeature } from "react";
import ReactDOM from "react-dom";
import { MapContainer, GeoJSON, MapConsumer, useMapEvent, useMap, TileLayer } from 'react-leaflet'
import mapData from "../Data/countries.json";
import CountryCenters from  "../Data/new_mini.json";
import area from '@turf/area';
import N from '../arrows/N.png';
import S from '../arrows/S.png';
import E from '../arrows/E.png';
import W from '../arrows/W.png';
import NW from '../arrows/NW.png';
import NNW from '../arrows/NNW.png';
import WNW from '../arrows/WNW.png';
import NE from '../arrows/NE.png';
import NNE from '../arrows/NNE.png';
import ENE from '../arrows/ENE.png';
import SW from '../arrows/SW.png';
import SSW from '../arrows/SSW.png';
import WSW from '../arrows/WSW.png';
import SE from '../arrows/SE.png';
import SSE from '../arrows/SSE.png';
import ESE from '../arrows/ESE.png';
import GuessMap from "./guess_map";


function ResultsMap(props) {    
    // const [guessList, setGuessList] = useState(props.guess_list);
    // const [map, setMap] = useState(null);
    // var guess_list_len = (props.guess_list).length;


    function get_arrow(query_direction) {
        if (query_direction === "N") {
            return N;
        } else if (query_direction === "S") {
            return S;
        } else if (query_direction === "E") {
            return E;
        } else if (query_direction === "W") {
            return W;
        } else if (query_direction === "NW") {
            return NW;
        } else if (query_direction === "NNW") {
            return NNW;
        } else if (query_direction === "WNW") {
            return WNW;
        } else if (query_direction === "NE") {
            return NE;
        } else if (query_direction === "NNE") {
            return NNE;
        } else if (query_direction === "ENE") {
            return ENE;
        } else if (query_direction === "SW") {
            return SW;
        } else if (query_direction === "SSW") {
            return SSW;
        } else if (query_direction === "WSW") {
            return WSW;
        } else if (query_direction === "SE") {
            return SE;
        } else if (query_direction === "SSE") {
            return SSE;
        } else if (query_direction === "ESE") {
            return ESE;
        } else {
            return N;
        }
    }

    function in_guess_list(country) {
        var len = props.guess_list.length;
        var i;
        var ret_val = false;
        for (i = 0; i < len; ++i) {
            
            if (country === props.guess_list[i].guessed_country) {
                console.log(props.guess_list[i].guessed_country)
                ret_val = true;
                break;
            } else {
                continue;
            }
        }

        return ret_val;
    }

    function set_zoom(country_name){
        var random_country = country_name;
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
            zoom_level = 8;
        }
        else if ((temp_area > 5000) && (temp_area < 100000)) {
            zoom_level = 6.5; 
        } else if ((temp_area > 100000) && (temp_area < 250000)) {
            zoom_level = 5;
        } else if ((temp_area > 250000) && (temp_area < 750000)) {
            zoom_level = 4
        } else {
            zoom_level = 2;
        }

    
        return zoom_level;
    }


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

        return final_country_center;
    }

    function OnEachCountry (country, layer) {
        const countryName = country.properties.ADMIN;
        // layer.setStyle(
        //     {
        //         color: "black",
        //         fillColor: "white",
        //         fillOpacity: 100,
        //         Weight: 1,
        //     }
        // )
        

        // if country is the destination
        if (countryName === props.dest) {
            layer.bindPopup(countryName);
            layer.togglePopup();
            layer.setStyle(
                {
                    color: "green",
                    fillColor: "green",
                    weight: 2,
                    fillOpacity: 0.5,
                }
            )
        }
        
        // if country is in the guess list
        else if (in_guess_list(countryName) === true) {
            layer.bindPopup(countryName);
            layer.togglePopup();
            layer.setStyle(
                {
                    color: "red",
                    fillColor: "red",
                    weight: 2,
                    fillOpacity: 0.5,
                }
            )
        // rest of the countries
        } else {
            layer.setStyle(
                {
                    color: "white",
                    fillColor: "#1f1f1f",
                    weight: 0,
                    fillOpacity: 0,
                }
            )
        }
        

    }


    function SetViewOnClick() {

        const map = useMap();


        const countries_arr = props.guess_list;

        

        var guess_length = countries_arr.length; // 4
        var i = 1;

        map.flyTo(get_country_center(countries_arr[0].guessed_country), set_zoom(countries_arr[0].guessed_country) );
        
        var timer = setInterval(function() {
            if (i < guess_length) { 
                console.log("NEXT");
                console.log(countries_arr[i]);
                var center = get_country_center(countries_arr[i].guessed_country)
                var zoomed = set_zoom(countries_arr[i].guessed_country)
                map.flyTo(center, zoomed);
                
                i = i + 1;
 
            } else {
                console.log(props.dest);
                map.flyTo(get_country_center(props.dest), set_zoom(props.dest));
                console.log("DONE");
                clearInterval(timer);
            }
        }, 4500);

        return null
    }
      
    function Animate() {
        return (
          <>
                <MapContainer
                    className={'map_container'}
                    style={{ height: "80vh"}}
                    zoom={2}
                    center={[20, 100]}
                    zoomControl={true}
                    dragging={true}
                    doubleClickZoom={false}
                    scrollWheelZoom={true} 
                    >
                    {/* takes an array of country features */}
                    {/* YOU CAN FILTER AND PASS THE RANDOM COUNTRY THROUGH HERE */}
                    <GeoJSON data={mapData.features} onEachFeature={OnEachCountry} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <SetViewOnClick guess_list = {props.guess_list}/>

                </MapContainer>

          </>
        )
      }

    return Animate();




};

// Exporting the component

// export const MemoizedDestinationMap = React.memo(DestinationMap);
export default ResultsMap;