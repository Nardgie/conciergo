// Setting it up so that if a user event is selected, it will show up on the top
// Still Working on that logic

// Update the imageUrl variable with the path to the drinks image
var imageUrl = '\wireframe\assets\images\drinks.jpg';

// Use the imageUrl variable in eventHtml template
// Assuming you have an object called selectedEvent with the imageURL property

var selectedEvent = {
    imageURL: "path/to/selectedEventImage.jpg"
};

// Select the eventImage element
var eventImage = document.getElementById('eventImage');

// Set the src attribute of the eventImage element
eventImage.setAttribute('src', selectedEvent.imageURL);


var eventHtml = `
    <div class="tile is-parent carousel-item">
        <div class="card">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img src="${imageUrl}" alt="${event.name}">
                </figure>
            </div>
            <div class="card-content is-flex-wrap-wrap">
                <p class="title is-4">${event.name}</p>
                <p class="subtitle is-6">${distance} Miles away</p>
                <p class="title is-6">${venue.name}</p>
                
                <p class="title is-6">${venue.city.name}, ${venue.state.name}</p>
                <p class="subtitle is-6">${date}</p>
            </div>
            <footer class="card-footer is-centered">
                <nav class="level is-mobile">
                    <div class="level-item">
                        <span>
                            <a class="button is-info card-footer-item" href="${event.url}" target="_blank">Get Tickets</a>
                            <small class="card-footer-item">Price Range: ${priceRange} </small>
                        </span>
                    </div>
                </nav>
            </footer>
        </div>
    </div>
`;

document.addEventListener("DOMContentLoaded", function() {
    // Function to handle form submission
    function handleFormSubmission(event) {
        event.preventDefault();
        // Get selected event from the form
        var formData = new FormData(event.target);
        var selectedEvent = formData.get('selectedEvent');
        // Update the page with the selected event
        updateSelectedEvent(selectedEvent);
        // Fetch nearby places based on the selected event's location
        fetchNearbyPlaces(selectedEvent.location);
    }
// // Setting it up so that if a user event is selected, it will show up on the top
// //Still Working on that logic
// document.addEventListener("DOMContentLoaded", function() {
//     // Function to handle form submission
//     function handleFormSubmission(event) {
//         event.preventDefault();
//         // Get selected event from the form
//         var formData = new FormData(event.target);
//         var selectedEvent = formData.get('selectedEvent');
//         // Update the page with the selected event
//         updateSelectedEvent(selectedEvent);
//         // Fetch nearby places based on the selected event's location
//         fetchNearbyPlaces(selectedEvent.location);
//     }

//     // Function to update the page with the selected event
//     function updateSelectedEvent(event) {
//         var eventNameElement = document.getElementById('eventName');
//         eventNameElement.textContent = event.name;
//         var eventDateElement = document.getElementById('eventDate');
//         eventDateElement.textContent = event.date;
//         var eventLocationElement = document.getElementById('eventLocation');
//         eventLocationElement.textContent = event.location;
//         // Additional event details can be updated here
//     }

//     // Function to fetch nearby restaurants and bars
//     async function fetchNearbyPlaces(location) {
//         try {
//             // Make API request to fetch nearby places based on location
//             var response = await fetch(`https://api.example.com/places?location=${location}`);
//             var data = await response.json();
//             displayNearbyPlaces(data);
//         } catch (error) {
//             console.error('Error fetching nearby places:', error);
//         }
//     }

//     // Function to display nearby restaurants and bars
//     function displayNearbyPlaces(places) {
//         var restaurantList = document.getElementById('restaurantList');
//         restaurantList.innerHTML = ''; // Clear previous results
//         // Iterate over places and create HTML elements to display them
//         places.forEach(place => {
//             var placeElement = document.createElement('div');
//             placeElement.classList.add('place');
//             placeElement.innerHTML = `
//                 <h3>${place.name}</h3>
//                 <p>${place.address}</p>
//             `;
//             restaurantList.appendChild(placeElement);
//         });
//     }

//     // Initial setup: Assuming user has already selected an event
//     var selectedEvent = {
//         name: 'Selected Event Name',
//         date: 'Selected Event Date',
//         location: 'Selected Event Location'
//     };
//     updateSelectedEvent(selectedEvent);
//     fetchNearbyPlaces(selectedEvent.location);
// });

// // Define variables for event form and nearby restaurants list
// var eventForm = document.getElementById('eventForm');
// var restaurantList = document.getElementById('restaurantList');

// // Function to fetch nearby restaurants and bars
// function fetchNearbyPlaces() {
//     // implement the logic here to fetch nearby places using APIs
//     // Iterate through fetched places and create HTML elements to display them
//     nearbyPlaces.forEach(function(place) {
//         var placeElement = document.createElement('div');
//         placeElement.classList.add('place');

//         var nameElement = document.createElement('p');
//         nameElement.textContent = place.name;
//         placeElement.appendChild(nameElement);

//         var distanceElement = document.createElement('p');
//         distanceElement.textContent = 'Distance: ' + place.distance;
//         placeElement.appendChild(distanceElement);

//         var ratingElement = document.createElement('p');
//         ratingElement.textContent = 'Rating: ' + place.rating;
//         placeElement.appendChild(ratingElement);

//         restaurantList.appendChild(placeElement);
//     });
// }

// // Event listener for form submission
// eventForm.addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission behavior
//     fetchNearbyPlaces(); // Fetch nearby places when form is submitted
// });


var gloablLat;
var globalLon;
var venue;

// function getLocation() {
//     navigator.geolocation.getCurrentPosition(showPosition, showError);
// }

function showPosition(data) {
    var apiKey = 'f626ccfbd488461d9c902410259022da';
    // API endpoint for geolocation
    var apiEndpoint = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + apiKey;

    // Make a request to the API
    fetch(apiEndpoint)
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        // Log the API response to the console
        // use the data to pull specifics
        gloablLat = data.latitude;
        globalLon = data.longitude;
        var latlon = gloablLat + "," + globalLon;
        console.log(latlon);
        console.log('Geolocation API Response:', data);

        // var x = document.getElementById("location");
        // x.innerHTML = "Latitude: " + gloablLat + 
        // "<br>Longitude: " + globalLon; 

        $.ajax({
            type:"GET",
            url:"https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=9xDaR1A6yRioMl6Xk2GG6ccydbFsnQZp&latlong="+latlon+"&radius=50&unit=miles&size=25",
            async:true,
            dataType: "json",
            success: function(json) {
                        console.log(json);
                        console.log(json.page.totalElements + " events found.");
                        // console.log(response.json)
                        var e = document.getElementById("events");
                        // e.innerHTML = " events found";
                        // json.page.totalElements + " events found.";
                        // showPosition();
                        showEvents(json);
                        initMap(data, json);
                    },
            error: function(xhr, status, err) {
                        console.log(err);
                    }
            });
        })
        .catch(function(error) {
        console.error('Error fetching geolocation data:', error);
        });

}


function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}
var item;

function showEvents(json) {
    // Calculate distances and store events with distance
    var eventsWithDistances = json._embedded.events.map(function(event) {
        var venue = event._embedded.venues[0];
        var distance = haversineDistance(gloablLat, globalLon, venue.location.latitude, venue.location.longitude).toFixed(2);
        item = {
            event: event,
            distance: distance
        }


        return item;
    });

    // Sort events by distance
    eventsWithDistances.sort(function(a, b) {
        return parseFloat(a.distance) - parseFloat(b.distance);
    });

    //sort by date
    eventsWithDistances.sort(function(a, b) {
            return new Date(a.event.dates.start.dateTime) - new Date(b.event.dates.start.dateTime);
        });
    
    // Append sorted events to the DOM
    eventsWithDistances.forEach(function(item) {
        var event = item.event;
        var venue = event._embedded.venues[0];
        var distance = item.distance;
        var date = new Date(event.dates.start.dateTime).toLocaleDateString();
        var imageUrl = event.images[1].url;
        var priceRange = '';
        if (event.priceRanges && event.priceRanges.length >  0) {
    priceRange = `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`;
        } else {
            priceRange = 'Price range not available';
        }   
        var parkingInfo = venue.parking ? venue.parking.summary : 'Parking information not available';
        // <td>${venue.city.name}, ${venue.state.name}</p>
        var eventHtml = `
                    <tr class="card-content is-flex-wrap-wrap">
                        <td>${event.name}</td>
                        
                        <td>${venue.name}</td>
                        
                        
                        <td>${date}</td>
                        <td>${distance} Miles away</td>
                        <td class="level-right"><a class="button is-small is-primary"
                                                href="#">Action</a></td>
                    </tr>
        `;

            // <article class="media">
            //     <figure class="media-left">
            //         <p class="image is-128x128">
            //             <img src="${imageUrl}" alt="${event.name}">
            //         </p>
            //     </figure>
            //     <div class="media-content">
            //         <div class="content">
            //             <p>
            //                 <strong>${event.name}</strong><br>
            //                 <small>${venue.name}, ${venue.city.name}</small><br>
            //                 <small>${distance} Miles away</small><br>
            //                 <small>${date}</small><br>
            //                 <small>Price Range: ${priceRange}</small><br>
            //                 <small>${parkingInfo}</small>
            //             </p>
            //         </div>
            //         <nav class="level is-mobile">
            //             <div class="level-right">
            //                 <a class="button is-info" href="${event.url}" target="_blank">Get Tickets</a>
            //             </div>
            //         </nav>
            //     </div>
            // </article>`;

        $("tbody").append(eventHtml);
    });

    // //init bulma carousel
    // bulmaCarousel.attach(".carousel", {
    //     slidesToShow:  1,
    //     slidesToScroll:  1,
    //     duration: 500,
    //     loop: true,
    //     autoplay: true,
    //     autoplaySpeed: 5000,
    //     infinite: true,
    //     pagination: true,
    //     navigation: true,
    //     navigationSwipe: true,
    //     pauseOnHover: false
    // });
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const phi1 = lat1 * Math.PI/180; // Convert degrees to radians
    const phi2 = lat2 * Math.PI/180;
    const deltaPhi = (lat2-lat1) * Math.PI/180;
    const deltaLambda = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // Distance in meters
    const dInMiles = d / 1609.34; // Convert meters to miles
    return dInMiles;
}


function initMap(position, json) {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: {lat: gloablLat, lng: globalLon},
        zoom: 11
    });

    for(var i=0; i<json.page.size; i++) {
        addMarker(map, json._embedded.events[i]);
    }
}

function addMarker(map, event) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
        map: map
    });
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    console.log(marker);
}
// var data; 

// function getWeather(lat, lon, callback){
//     var apiKey = '9fda455ae9137822224a160754647dd2';
//     var forecastApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

//     var lat = venue.location.latitude
//     var lon = venue.location.longitude
    
//     fetch(forecastApi)
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(data) {
//         // Example of logging the forecast data
//         console.log(data);
//         data.forEach(function(forecastEntry) {
//             // Get the weather description and icon code
//             var weatherDescription = forecastEntry.weather[0].description;
//             var iconCode = forecastEntry.weather[0].icon;

//             // Construct the icon URL using the icon code
//             var iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

//             // Create an HTML element to display the weather icon and description
//             var weatherElement = document.createElement('div');
//             weatherElement.innerHTML = `<img src="${iconUrl}" alt="${weatherDescription}"> ${weatherDescription}`;

//             // Add the weather element to the DOM where you want to display the forecast
//         });
        
//         // Extract and display the forecast information here
//         // For instance, you could loop through the list array and create HTML elements to display the forecast
//     });
// }

// // Assuming `forecastData` is the JSON object returned from the API call
// // data.forEach(function(forecastEntry) {
// //     // Get the weather description and icon code
// //     var weatherDescription = forecastEntry.weather[0].description;
// //     var iconCode = forecastEntry.weather[0].icon;

// //     // Construct the icon URL using the icon code
// //     var iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

// //     // Create an HTML element to display the weather icon and description
// //     var weatherElement = document.createElement('div');
// //     weatherElement.innerHTML = `<img src="${iconUrl}" alt="${weatherDescription}"> ${weatherDescription}`;

// //     // Add the weather element to the DOM where you want to display the forecast
// // });
