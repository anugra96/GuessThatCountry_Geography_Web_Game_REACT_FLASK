import React, { useContext } from "react";
import { MapContainer, GeoJSON, useMap, TileLayer } from 'react-leaflet'
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
import { GuessContext } from "../Contexts/GuessContext";


function ResultsMap() {    

    const { guess_list, destination } = useContext(GuessContext);

    function in_guess_list(country) {
        var len = guess_list.length;
        var i;
        var ret_val = false;
        for (i = 0; i < len; ++i) {
            
            if (country === guess_list[i].guessed_country) {
                console.log(guess_list[i].guessed_country)
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
        

        // if country is the destination
        if (countryName === destination) {
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


        const countries_arr = guess_list;

        

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
                console.log(destination);
                map.flyTo(get_country_center(destination), set_zoom(destination));
                console.log("DONE");
                clearInterval(timer);
            }
        }, 4500);

        return null
    }

    function refreshPage() {
        window.location.reload(false);
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
                    <SetViewOnClick />

                </MapContainer>

                <div>
                    <button onClick={refreshPage}>New Game </button>
                </div>

          </>
        )
      }

    return Animate();




};

// Exporting the component
export default ResultsMap;