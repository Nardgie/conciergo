var gloablLat;
var globalLon;

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

function showEvents(json) {
    // Calculate distances and store events with distance
    var eventsWithDistances = json._embedded.events.map(function(event) {
        var venue = event._embedded.venues[0];
        var distance = haversineDistance(gloablLat, globalLon, venue.location.latitude, venue.location.longitude).toFixed(2);
        return {
            event: event,
            distance: distance
        };
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
        var priceRange = `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`;
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

getLocation();




//192.168.1.12
// google maps key: AIzaSyCj3wvLnBaKeIBdhCqaNrp14KyEq9KB1pY