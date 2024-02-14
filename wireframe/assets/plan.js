
$(document).ready(function () {
    var gloablLat;
    var globalLon;
    var venue;
    var map;
    var service;
    var infowindow;
    var venueLat;
    var venueLng;

 
    function showPosition(data) {

        var token = "6417bd03e4fe33";

        // API endpoint for geolocation
        var apiEndpoint = `https://ipinfo.io/json?token=${token}`;

        // Make a request to the API
        fetch(apiEndpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
            
                gloablLat = data.loc.split(",")[0];
                globalLon = data.loc.split(",")[1];
                userCity = data.city;
                console.log(userCity);
                var latlon = data.loc.split(",");
                console.log(latlon);
                console.log("Latitude: " + gloablLat);
                console.log("Longitude: " + globalLon);
                console.log("Geolocation API Response:", data);

              
                $.ajax({
                    type: "GET",
                    url: "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=9xDaR1A6yRioMl6Xk2GG6ccydbFsnQZp&latlong=" + latlon + "&radius=50&unit=miles&size=25",
                    async: true,
                    dataType: "json",
                    success: function (json) {
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
                    error: function (xhr, status, err) {
                        console.log(err);
                    }
                });
            })
            .catch(function (error) {
                console.error('Error fetching geolocation data:', error);
            });

    }


    function showError(error) {
        switch (error.code) {
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
        var eventsWithDistances = json._embedded.events.map(function (event) {
            var venue = event._embedded.venues[0];
            var distance = haversineDistance(gloablLat, globalLon, venue.location.latitude, venue.location.longitude).toFixed(2);
            item = {
                event: event,
                distance: distance
            }


            return item;
        });

        // Sort events by distance
        eventsWithDistances.sort(function (a, b) {
            return parseFloat(a.distance) - parseFloat(b.distance);
        });

        //sort by date
        eventsWithDistances.sort(function (a, b) {
            return new Date(a.event.dates.start.dateTime) - new Date(b.event.dates.start.dateTime);
        });

      
            
        

        // Append sorted events to the DOM
        eventsWithDistances.forEach(function (item) {
            var event = item.event;
            console.log(event);
            var venue = event._embedded.venues[0];
            // console.log(venue);
            var distance = item.distance;
            var date = new Date(event.dates.start.dateTime).toLocaleDateString();
            var imageUrl = event.images[1].url;
            var priceRange = '';
            if (event.priceRanges && event.priceRanges.length > 0) {
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
                            <td class="level-right"><button class="button is-small is-primary add" data-event='${JSON.stringify(event
                            ).replace(/'/g,
                            "&apos;")}'>Add To Plan</button></td>
                        </tr>
            `;

            var $eventRow = $(eventHtml).appendTo("#concerts");
            $eventRow.find(".add").data("event", event);
         
        });
        $(document).on("click", ".add", function (e) {
          e.preventDefault();
          var eventData = $(this).data("event");
          //Change the class of col-2 from is-hidden to is-visible
          $("#col-2").removeClass("is-hidden");
        //   var placeData = $(this).data("place");
          if (eventData) {
            displayEventCard(eventData); // Function to display the event card
            $(this).text("Added").attr("disabled", true); // Change button text and disable it
            console.log(eventData);
          } else {
            console.error("No event data found for the clicked button.");
          }

   
        });
    }
    function displayEventCard(event) {
     
      console.log("Event data received:", event); // Debugging log

      
      if (
        !event._embedded ||
        !event._embedded.venues ||
        !event._embedded.venues[0]
      ) {
        console.error("Invalid event data structure:", event);
        return; 
      }

      var venue = event._embedded.venues[0];

      var venue = event._embedded.venues[0];
      var date = new Date(event.dates.start.dateTime).toLocaleDateString();
      var imageUrl = event.images[1].url;
      var priceRange = event.priceRanges
        ? `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`
        : "Price range not available";

      venueLat = event._embedded.venues[0].location.latitude;
      venueLng = event._embedded.venues[0].location.longitude;

     

      var cardHtml = `
        <div class="tile is-ancestor has-text-centered ">

            <div class="tile is-parent">
                <article class="tile is-child box" style="background-image: url('${imageUrl}'); background-size: cover;">
                        <p class="subtitle">${event.name}</p>
                        <p class="subtitle">${venue.name}</p>
                        <p class="subtitle">${date}</p>
                </article>
            </div>
        </div>
        `;

        

      $("#tileContainer").append(cardHtml); // Make sure to have a div with id="eventCardContainer" in your HTML
      // Fetch nearby places
        fetchNearbyPlaces(venueLat, venueLng);
    }

    function addPlaceToPlan(place) {
        console.log("Event data received:", place);
        if (
          !place.name ||
          !place.vicinity) {
          console.error("Invalid event data structure:", place);
          return; // Exit the function if the data structure is not as expected
        }

        // Add place to plan
        clubTileHtml = `
        <div class="tile is-ancestor has-text-centered ">

            <div class="tile is-parent">
                <article class="tile is-child box">
                        <p class="subtitle">${place.name}</p>
                        <p class="subtitle">${place.vicinity}</p>
                        
                </article>
            </div>
        </div>
        `;
            $("#tileContainer").append(clubTileHtml);
    }
    $(document).on("click", ".add.club", function (e) {
        e.preventDefault();
        var placeData = $(this).data("place");

        // var place = JSON.parse(placeData);
        if (placeData) {
            addPlaceToPlan(placeData); // Function to display the event card
            $(this).text("Added").attr("disabled", true); // Change button text and disable it
            console.log(placeData);
        } else {
            console.error("No event data found for the clicked button.");
        }
        console.log(placeData);
    });

    function haversineDistance(lat1, lon1, lat2, lon2) {
                const R = 6371e3; // Earth's radius in meters
                const phi1 = lat1 * Math.PI / 180; // Convert degrees to radians
                const phi2 = lat2 * Math.PI / 180;
                const deltaPhi = (lat2 - lat1) * Math.PI / 180;
                const deltaLambda = (lon2 - lon1) * Math.PI / 180;

                const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                    Math.cos(phi1) * Math.cos(phi2) *
                    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                const d = R * c; // Distance in meters
                const dInMiles = d / 1609.34; // Convert meters to miles
                return dInMiles;
            }

    function fetchNearbyPlaces(lat, lon) {
        var apiKey = 'AIzaSyCj3wvLnBaKeIBdhCqaNrp14KyEq9KB1pY';

        var request = {
            location: new google.maps.LatLng(lat, lon),
            radius: '5000',
            type: ['bar'],
            fields: ['name', 'vicinity', 'rating', 'opening_hours', 'utc_offset_minutes']
        };

        service.nearbySearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log(results);
                // Display nearby places
                displayPlaces(results);
            } else {
                console.error('Error fetching nearby places:', status);
            }
            
            const isOpenNow = place.opening_hours.isOpen();
            if (isOpenNow) {
                console.log('The place is open now');
            }
        });
    }

    function displayPlaces(places) {
        
        places.forEach(function (place) {
            

            var createEventTableHTML = `
            
            <tr class="card-content is-flex-wrap-wrap">
                <td>${place.name}</td>
                <td>${place.vicinity}</td>
                <td>${place.rating}</td>
                <td class="level-right"><button class="button is-small is-primary add club" data-place='${JSON.stringify(place).replace(/'/g,"&apos;")}'>Add To Plan</button></td>
            </tr>`;

            var $clubRow = $("#clubs").append(createEventTableHTML);
            $clubRow.find(".add").data("place", place);
        });
    }

    
    function initMap(position, json) {
        var location = new google.maps.LatLng(venueLat, venueLng);
                var mapDiv = document.getElementById('map');
                map = new google.maps.Map(mapDiv, {
                    center: { lat: gloablLat, lng: globalLon },
                    zoom: 11
                });
       
                var request = {
                  location: location,
                  radius: "500",
                  type: ["restaurant"],
                  fields: [
                    "name",
                    "vicinity",
                    "rating",
                    "opening_hours",
                    "utc_offset_minutes",
                  ]
                };
                console.log(request);
                service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, callback);

                for (var i = 0; i < json.page.size; i++) {
                    addMarker(map, json._embedded.events[i]);
                }
            }

            function callback(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                    map.setCenter(results[0].geometry.location);
                    if (map) {
                        map.setCenter(results[0].geometry.location);
                    } else {
                        console.error("Map is not initialized");
                    }
                }

                console.log(results);
            }

            function createMarker(place) {
                if (!place.geometry || !place.geometry.location) return;

                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(place.name || '');
                    infowindow.open(map);
                });
            }

    window.initMap = initMap;


    function addMarker(map, event) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
                    map: map
                });
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
                console.log(marker);
            }
    