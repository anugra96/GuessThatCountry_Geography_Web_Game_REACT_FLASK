import React, { useState, useEffect, useCallback, useRef, onEachFeature } from "react";
import ReactDOM from "react-dom";
import { MapContainer, GeoJSON, MapConsumer, useMapEvent, useMap } from 'react-leaflet'
import mapData from "../Data/countries.json";
import CountryCenters from  "../Data/new_mini.json";
import area from '@turf/area';


function ResultsMap(props) {    
    // const [guessList, setGuessList] = useState(props.guess_list);
    // const [map, setMap] = useState(null);
    // var guess_list_len = (props.guess_list).length;

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
        layer.setStyle(
            {
                color: "black",
                fillColor: "white",
                fillOpacity: 100,
                Weight: 1,
            }
        )

    }


    function SetViewOnClick(props) {

        const map = useMap();

        // const india = [28.644800, 77.216721];
        // const canada = [56.130366, -106.346771];
        // const india2 = [28.644800, 77.216721];
        // const canada2 = [56.130366, -106.346771];
        // const arr = [india, canada, india2, canada2];

        const countries_arr = props.guess_list;
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
                console.log("DONE");
                clearInterval(timer);
            }
        }, 4000);


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
                    style={{ height: "100vh" }}
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