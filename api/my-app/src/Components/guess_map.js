import React, { useState, useEffect, useCallback, useRef, onEachFeature } from "react";
import ReactDOM from "react-dom";
import { MapContainer, GeoJSON, MapConsumer, useMapEvent, useMap } from 'react-leaflet'
import mapData from "../Data/countries.json";
import CountryCenters from  "../Data/new_mini.json";


function GuessMap(props) {
    // const [guess, setGuess] = useState(props.guess_country);
    
    const [guessList, setGuessList] = useState(props.guess_list);
    const [map, setMap] = useState(null);

    
    var guess_list_len = (props.guess_list).length;



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

        // const center_obj = {
        //     "lat": final_country_center[0],
        //     "lon": final_country_center[1]
        // };
        return final_country_center;
    }

    function OnEachCountry (country, layer) {

        const countryName = country.properties.ADMIN;
        

        // if (props.guess_country === countryName) {
        //     layer.setStyle(
        //         {
        //             color: "red",
        //             fillOpacity: 100,
        //             opacity: 0,
        //         }
        //     )
        // } else {
        //     layer.setStyle(
        //         {
        //             color: "black",
        //             fillColor: "white",
        //             fillOpacity: 100,
        //             opacity: 0,
        //             Weight: 0.01,
        //         }
        //     )
        // }
        layer.setStyle(
            {
                color: "black",
                fillColor: "white",
                fillOpacity: 100,
                Weight: 1,
            }
        )

    }

    // function handleSetView() {
    //     const {current = {}} = mapRef;
    //     const {leafletElement: map} = current;
    //     map.setView([20,100]);
    //     console.log("setView");
    // }

    // function handleFlyTo() {
    //     console.log("FlyTo");
    // }

    function SetViewOnClick() {
        const [guess_count, setGuessCount] = useState(0);

        // var center = get_country_center(props.guess_list[guess_count].guessed_country);
        // console.log(props.guess_list[guess_count]);
        // console.log(guess_count);
        
        const map = useMap();

        // const onClick = () => {
        //     setGuessCount(guess_count + 1);
        //     map.flyTo([center.lat, center.lon], 5);
        // }       


        useEffect(() => {


            
            var guesses = props.guess_list;
            console.log(guesses);
            console.log(guess_count);
            var guessed = (guesses[guess_count]).guessed_country;
            
            console.log(guessed);
            map.flyTo(get_country_center(guessed), 5);
        }, [guess_count]);

        return <>
        {guess_count < 5 && 
        setGuessCount(guess_count + 1)}
        </>
    }
      
    function AnimateExample() {
      
        return (
          <>
            {/* <p>
              <label>
                <input
                  type="button"
                  onChange={() => {
                    setGuessCount(guess_count + 1);
                    SetViewOnClick();
                  }}
                />
                Next
              </label>
            </p> */}
                <MapContainer
                    style={{ height: "100vh" }}
                    zoom={5}
                    center={[20, 100]}
                    zoomControl={true}
                    dragging={true}
                    doubleClickZoom={false}
                    scrollWheelZoom={true} 
                    whenCreate={setMap}>
                    {/* takes an array of country features */}
                    {/* YOU CAN FILTER AND PASS THE RANDOM COUNTRY THROUGH HERE */}
                    <GeoJSON data={mapData.features} onEachFeature={OnEachCountry} />
                    {/* <MapConsumer >
                {(map) => {
                    var i = 0;
                    var guesses = props.guess_list;
                    for (i = guess_list_len; i < guess_list_len; ++i) {
                        setGuessCount(guess_count - 1);
                        var guessed = (guesses[i]).guessed_country;
                        map.flyTo(get_country_center(guessed), 5);
                        setTimeout(() => {}, 5000);
                    }
                    
                }}
            </MapConsumer> */}
                    {/* <SetViewOnClick animateRef={animateRef} /> */}
                    <SetViewOnClick />

                </MapContainer>
                
                
          </>
        )
      }

    return AnimateExample();
    
    
    
    
    
    
    // <>

    //     <div>
    //         <button onClick={handleSetView}> Next </button>
    //     </div>

    //     <MapContainer 
    //         ref={mapRef}
    //         style={{ height: "100vh"}} 
    //         zoom={5} 
    //         center={[20,100]} 
    //         zoomControl={false} 
    //         dragging={false}
    //         doubleClickZoom={false}
    //         scrollWheelZoom={false} >
    //         {/* takes an array of country features */}
    //         {/* YOU CAN FILTER AND PASS THE RANDOM COUNTRY THROUGH HERE */}
    //         <GeoJSON data={mapData.features} onEachFeature={OnEachCountry}/>
    //         {/* <MapConsumer >
    //             {(map) => {
    //                 var i = 0;
    //                 var guesses = props.guess_list;
    //                 for (i = guess_list_len; i < guess_list_len; ++i) {
    //                     setGuessCount(guess_count - 1);
    //                     var guessed = (guesses[i]).guessed_country;
    //                     map.flyTo(get_country_center(guessed), 5);
    //                     setTimeout(() => {}, 5000);
    //                 }
                    
    //             }}
    //         </MapConsumer> */}
    //         <SetViewOnClick animateRef={animateRef} />
    //     </MapContainer>



    // </>




};

// Exporting the component

// export const MemoizedDestinationMap = React.memo(DestinationMap);
export default GuessMap;