import React, { useState, useEffect, useCallback, useRef, onEachFeature } from "react";
import ReactDOM from "react-dom";
import { MapContainer, GeoJSON, MapConsumer, useMapEvent, useMap, TileLayer } from 'react-leaflet'
import mapData from "../Data/countries.json";
import CountryCenters from  "../Data/new_mini.json";
import area from '@turf/area';


function ResultsMap(props) {    
    // const [guessList, setGuessList] = useState(props.guess_list);
    // const [map, setMap] = useState(null);
    // var guess_list_len = (props.guess_list).length;

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

        // const india = [28.644800, 77.216721];
        // const canada = [56.130366, -106.346771];
        // const india2 = [28.644800, 77.216721];
        // const canada2 = [56.130366, -106.346771];
        // const arr = [india, canada, india2, canada2];

        const countries_arr = props.guess_list;
        const destination = props.dest;
        console.log(countries_arr);
        

        var guess_length = countries_arr.length; // 4
        var i = 0;
        
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
        }, 5000);


        // map.flyTo([28.644800, 77.216721], 5);


        // map.flyTo([28.644800, 77.216721], 5);


        // useEffect(() => {
        //     var guesses = props.guess_list;
        //     console.log(guesses);
        //     console.log(guess_count);
        //     var guessed = (guesses[guess_count]).guessed_country;
            
        //     console.log(guessed);
        //     map.flyTo(get_country_center(guessed), 5);
        // }, [guess_count]);

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
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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