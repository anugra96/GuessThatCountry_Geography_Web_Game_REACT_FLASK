// import React, { Component, useEffect, useLayoutEffect } from "react";
// import { useMap } from "react-leaflet";
// import L, { LeafletMouseEvent, map, Map } from "leaflet";



// function Description(props) {
//     const map = useMap();
//     const [guess_count, setGuessCount] = useState(0);
//     // var helpDiv;



//     // function createButtonControl() {
//     //     const MapHelp = L.Control.extend({
//     //       onAdd: (map) => {
//     //         const helpDiv = L.DomUtil.create("button", "");
//     //         this.helpDiv = helpDiv;
//     //         helpDiv.innerHTML = this.props.title;
    
//     //         helpDiv.addEventListener("click", () => {
            
            
//     //             var i = 0;
//     //             var guesses = props.guess_list;
//     //             for (i = guess_list_len; i < guess_list_len; ++i) {
//     //                 setGuessCount(guess_count - 1);
//     //                 var guessed = (guesses[i]).guessed_country;
//     //                 map.flyTo(get_country_center(guessed), 5);
//     //                 setTimeout(() => { }, 5000);
//     //             }

//     //         });
    
//     //         //a bit clueless how to add a click event listener to this button and then
//     //         // open a popup div on the map
//     //         return helpDiv;
//     //       }
//     // });


//     var i = 0;
//     var guesses = props.guess_list;
//     for (i = guess_list_len; i < guess_list_len; ++i) {
//         setGuessCount(guess_count - 1);
//         var guessed = (guesses[i]).guessed_country;
//         map.flyTo(get_country_center(guessed), 5);
//         setTimeout(() => { }, 5000);
//     }



//     useEffect(() => {
//         createButtonControl();
//     }, [guess_count]);

//     return null


// }




// // function withMap(Component) {
// //   return function WrappedComponent(props) {
// //     const map = useMap();
// //     return <Component {...props} map={map} />;
// //   };
// // }

// export default Description(Description);
