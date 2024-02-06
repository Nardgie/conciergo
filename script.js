var gloablLat;
var globalLon;
var venue;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        var x = document.getElementById("location");
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
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

        var x = document.getElementById("location");
        x.innerHTML = "Latitude: " + gloablLat + 
        "<br>Longitude: " + globalLon; 

        $.ajax({
            type:"GET",
            url:"https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=9xDaR1A6yRioMl6Xk2GG6ccydbFsnQZp&latlong="+latlon,
            async:true,
            dataType: "json",
            success: function(json) {
                        console.log(json);
                        console.log(json.page.totalElements + " events found.");
                        // console.log(response.json)
                        var e = document.getElementById("events");
                        e.innerHTML = json.page.totalElements + " events found.";
                        showEvents(json);
                        initMap(position, json);
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
        return a.distance - b.distance;
    });

    // Append sorted events to the DOM
    eventsWithDistances.forEach(function(item) {
        var event = item.event;
        var venue = event._embedded.venues[0];
        var distance = item.distance;
        var date = new Date(event.dates.start.dateTime).toLocaleDateString();
        var imageUrl = event.images[0].url;
        var priceRange = '';
        if (event.priceRanges && event.priceRanges.length >  0) {
    priceRange = `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`;
        } else {
            priceRange = 'Price range not available';
        }   
        var parkingInfo = venue.parking ? venue.parking.summary : 'Parking information not available';

        var eventHtml = `
            <article class="media">
                <figure class="media-left">
                    <p class="image is-128x128">
                        <img src="${imageUrl}" alt="${event.name}">
                    </p>
                </figure>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>${event.name}</strong><br>
                            <small>${venue.name}, ${venue.city.name}</small><br>
                            <small>${distance} Miles away</small><br>
                            <small>${date}</small><br>
                            <small>Price Range: ${priceRange}</small><br>
                            <small>${parkingInfo}</small>
                        </p>
                    </div>
                    <nav class="level is-mobile">
                        <div class="level-right">
                            <a class="button is-info" href="${event.url}" target="_blank">Get Tickets</a>
                        </div>
                    </nav>
                </div>
            </article>`;

        $("#events").append(eventHtml);
    });
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
        zoom: 10
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


getLocation();
// getWeather(venue.location.latitude, venue.location.longitude)





//192.168.1.12
// google maps key: AIzaSyCj3wvLnBaKeIBdhCqaNrp14KyEq9KB1pY
