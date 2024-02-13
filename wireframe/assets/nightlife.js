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

$(document).ready(function () {
  var gloablLat;
  var globalLon;
  var venue;
  var map;
  var service;
  var infowindow;
  var venueLat;
  var venueLng;
  var item;
  var userCity;

  // function getLocation() {
  //     navigator.geolocation.getCurrentPosition(showPosition, showError);
  // }

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
        // Log the API response to the console
        // use the data to pull specifics
        gloablLat = data.loc.split(",")[0];
        globalLon = data.loc.split(",")[1];
        userCity = data.city;
        console.log(userCity);
        var latlon = data.loc.split(",");
        console.log(latlon);
        console.log("Latitude: " + gloablLat);
        console.log("Longitude: " + globalLon); 
        console.log("Geolocation API Response:", data);

        // var x = document.getElementById("location");
        // x.innerHTML = "Latitude: " + gloablLat +
        // "<br>Longitude: " + globalLon;

        $.ajax({
          type: "GET",
          url:
            "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=9xDaR1A6yRioMl6Xk2GG6ccydbFsnQZp&latlong=" +
            latlon +
            "&radius=50&unit=miles&size=25",
          async: true,
          dataType: "json",
          success: function (json) {
            console.log(json);
            console.log(json.page.totalElements + " events found.");
            // console.log(response.json)
            // var e = document.getElementById("events");
            // e.innerHTML = " events found";
            // json.page.totalElements + " events found.";
            // showPosition();
            // showEvents(json);
            initMap(data, json);
            fetchNearbyPlaces(latlon);
            
          },
          error: function (xhr, status, err) {
            console.log(err);
          },
        });
      })
      .catch(function (error) {
        console.error("Error fetching geolocation data:", error);
      });
  }

  //function to show error if geolocation is not available
  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred.";
        break;
    }
  }

  //SHOW EVENTS!!!
  //function to show events

  //   function showEvents(json) {
  //     // Calculate distances and store events with distance
  //     var eventsWithDistances = json._embedded.events.map(function (event) {
  //       var venue = event._embedded.venues[0];
  //       var distance = haversineDistance(
  //         gloablLat,
  //         globalLon,
  //         venue.location.latitude,
  //         venue.location.longitude
  //       ).toFixed(2);
  //       item = {
  //         event: event,
  //         distance: distance,
  //       };

  //       return item;
  //     });

  //     // Sort events by distance
  //     eventsWithDistances.sort(function (a, b) {
  //       return parseFloat(a.distance) - parseFloat(b.distance);
  //     });

  //     //sort by date
  //     eventsWithDistances.sort(function (a, b) {
  //       return (
  //         new Date(a.event.dates.start.dateTime) -
  //         new Date(b.event.dates.start.dateTime)
  //       );
  //     });

  //     // Append sorted events to the DOM
  //     eventsWithDistances.forEach(function (item) {
  //       var event = item.event;
  //       console.log(event);
  //       var venue = event._embedded.venues[0];
  //       // console.log(venue);
  //       var distance = item.distance;
  //       var date = new Date(event.dates.start.dateTime).toLocaleDateString();
  //       var imageUrl = event.images[1].url;
  //       var priceRange = "";
  //       if (event.priceRanges && event.priceRanges.length > 0) {
  //         priceRange = `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`;
  //       } else {
  //         priceRange = "Price range not available";
  //       }
  //       var parkingInfo = venue.parking
  //         ? venue.parking.summary
  //         : "Parking information not available";
  //       // <td>${venue.city.name}, ${venue.state.name}</p>
  //       var eventHtml = `
  //                         <tr class="card-content is-flex-wrap-wrap">
  //                             <td>${event.name}</td>

  //                             <td>${venue.name}</td>

  //                             <td>${date}</td>
  //                             <td>${distance} Miles away</td>
  //                             <td class="level-right"><button class="button is-small is-primary add" data-event='${JSON.stringify(
  //                               event
  //                             ).replace(
  //                               /'/g,
  //                               "&apos;"
  //                             )}'>Add To Plan</button></td>
  //                         </tr>
  //             `;

  //       var $eventRow = $(eventHtml).appendTo("#concerts");
  //       $eventRow.find(".add").data("event", event);
  //       console.log($eventRow.find(".add").data("event"));
  //     });
  //     $(document).on("click", ".add", function (e) {
  //       e.preventDefault();
  //       var eventData = $(this).data("event");
  //       console.log(eventData);
  //       //Change the class of col-2 from is-hidden to is-visible
  //     //   $("#col-2").removeClass("is-hidden");
  //       //   var placeData = $(this).data("place");
  //       if (eventData) {
  //         displayEventCard(eventData); // Function to display the event card
  //         // fetchNearbyPlaces(venueLat, venueLng);
  //         console.log(fetchNearbyPlaces(venueLat, venueLng))

  //         $(this).text("Added").attr("disabled", true); // Change button text and disable it
  //         console.log(eventData);
  //       } else {
  //         console.error("No event data found for the clicked button.");
  //       }

  //     });
  //   }

  //DISPLAY EVENT CARDS!!
  //   function displayEventCard(event) {
  //     // Clear existing card or tile if you want only one at a time
  //     //   $("#eventCardContainer").empty();
  //     console.log("Event data received:", event); // Debugging log

  //     // Check if the necessary properties exist in the event object
  //     if (
  //       !event._embedded ||
  //       !event._embedded.venues ||
  //       !event._embedded.venues[0]
  //     ) {
  //       console.error("Invalid event data structure:", event);
  //       return; // Exit the function if the data structure is not as expected
  //     }

  //     var venue = event._embedded.venues[0];

  //     var venue = event._embedded.venues[0];
  //     var date = new Date(event.dates.start.dateTime).toLocaleDateString();
  //     var imageUrl = event.images[1].url;
  //     var priceRange = event.priceRanges
  //       ? `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`
  //       : "Price range not available";

  //     venueLat = event._embedded.venues[0].location.latitude;
  //     venueLng = event._embedded.venues[0].location.longitude;

  //     // var cardHtml = `
  //     //     <div class="tile is-ancestor has-text-centered ">

  //     //         <div class="tile is-parent">
  //     //             <article class="tile is-child box" style="background-image: url('${imageUrl}'); background-size: cover;">
  //     //                     <p class="subtitle">${event.name}</p>
  //     //                     <p class="subtitle">${venue.name}</p>
  //     //                     <p class="subtitle">${date}</p>
  //     //             </article>
  //     //         </div>
  //     //     </div>
  //     //     `;

  //     // $("#tileContainer").append(cardHtml); // Make sure to have a div with id="eventCardContainer" in your HTML
  //     // Fetch nearby places
  //     fetchNearbyPlaces(venueLat, venueLng);
  //   }

  //ADD PLACE TO PLAN FUNCTION!!
  //   function addPlaceToPlan(place) {
  //     console.log("Event data received:", place);
  //     if (!place.name || !place.vicinity) {
  //       console.error("Invalid event data structure:", place);
  //       return; // Exit the function if the data structure is not as expected
  //     }
  //     clubTileHtml = `
  //         <div class="tile is-ancestor has-text-centered ">

  //             <div class="tile is-parent">
  //                 <article class="tile is-child box">
  //                         <p class="subtitle">${place.name}</p>
  //                         <p class="subtitle">${place.vicinity}</p>

  //                 </article>
  //             </div>
  //         </div>
  //         `;
  //     $("#tileContainer").append(clubTileHtml);
  //   }
  //  //   $(document).on("click", ".add", function (e) {
  //   $(document).on("click", ".add.club", function (e) {
  //     e.preventDefault();
  //     var placeData = $(this).data("place");

  //     // var place = JSON.parse(placeData);
  //     if (placeData) {
  //       addPlaceToPlan(placeData); // Function to display the event card
  //       fetchNearbyPlaces(venueLat, venueLng);
  //       $(this).text("Added").attr("disabled", true); // Change button text and disable it
  //       console.log(placeData);
  //     } else {
  //       console.error("No event data found for the clicked button.");
  //     }
  //     console.log(placeData);
  //   });

  //   function haversineDistance(lat1, lon1, lat2, lon2) {
  //     const R = 6371e3; // Earth's radius in meters
  //     const phi1 = (lat1 * Math.PI) / 180; // Convert degrees to radians
  //     const phi2 = (lat2 * Math.PI) / 180;
  //     const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  //     const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  //     const a =
  //       Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
  //       Math.cos(phi1) *
  //         Math.cos(phi2) *
  //         Math.sin(deltaLambda / 2) *
  //         Math.sin(deltaLambda / 2);
  //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //     const d = R * c; // Distance in meters
  //     const dInMiles = d / 1609.34; // Convert meters to miles
  //     return dInMiles;
  //   }


  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const phi1 = (lat1 * Math.PI) / 180; // Convert degrees to radians
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // Distance in meters
    const dInMiles = d / 1609.34; // Convert meters to miles
    return dInMiles;
  }





  //FETCH!!
  //FETCH NEARBY PLACES FUNCTION!!!!!!

  function fetchNearbyPlaces(lat, lon, userCity) {
    var apiKey = "F9EC0B209B9C53B8421482D4B8C2F651";

    var request = {
      //   location: location,
        // radius: "5000",
      query: [
        `concert hall in ${userCity}`,
        `music venue in ${userCity}`,
        `stadium in ${userCity}`,
        `arena in ${userCity}`,
        `amphitheater in ${userCity}`,
        `live music in ${userCity}`,
        `event venue in ${userCity}`
      ].join(", "),
      types: ["concert_hall", "music_venue", "stadium", "parking"].join(", "),
      fields: ["name", "photos", "icon", "vicitinty"],
    };
    service = new google.maps.places.PlacesService(map);

    service.textSearch(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results = results.filter((place) => place.name !== "Pick up Kia Center");
        // Calculate distances and store venues with distances
        var venuesWithDistances = results.map(function (place) {
          var distance = haversineDistance(
            gloablLat,
            globalLon,
            place.geometry.location.lat, // lat()?
            place.geometry.location.lng //lng()??
          ).toFixed(2);
          return {
            place: place,
            distance: distance,
          };
        });
        // Sort venues by distance
        venuesWithDistances.sort(function (a, b) {
          return parseFloat(a.distance) - parseFloat(b.distance);
        });



        console.log(results);
        console.log(venuesWithDistances);
        // Display nearby places
        // displayPlaces(results);
        // var filteredResults = results.filter((place) => place.vicinity.includes(userCity));
        // console.log(filteredResults);
        // displayPlaces(filteredResults);
        
        venuesWithDistances.forEach(function (item) {
          var name = item.place.name;
          var address = item.place.formatted_address;
          var distance = item.distance;
          var icon = item.icon;
          var photo = item.place.photos[0].getUrl({ maxWidth: 250, maxHeight: 250 });
          if (!photo) {
            return;
          }
        //   if (name === "Pick up Kia Center") {
        //     // remove the venue from the list
        //     venuesWithDistances.filter((item) => item.place.name !== "Pick up Kia Center")};
          var tileHTML = `
                    <div class="tile has-text-centered is-horizontal center-position is-hidden">
                        <div class="tile is-parent">
                            <article class="tile is-child" style="display: flex; align-items: center; justify-content: center; background-image: url('${photo}'); background-size: cover;">
                                <button class="open js-modal-trigger" style="background-image: url('${photo}'); background-size: cover;"><p class="subtitle is-4">${name}</p></button>
                            </article>
                        </div>
                    </div>
                    `;
          $("#venues").append(tileHTML);
        document.addEventListener("DOMContentLoaded", () => {
            // Suppose you have the center of the page as centerX and centerY
            document.querySelectorAll('.tile.is-horizontal').forEach((tile, index) => {
                // tile.classList.add("center-position")
  // Logic to calculate final position goes here
  // For example, if they are to be spread in a grid:
                const x = (index % 3) * 100; // example x-coordinate
                const y = Math.floor(index / 3) * 100; // example y-coordinate
                tile.style.transform = `translate(${x}px, ${y}px)`;
            });
            
        })

        $(document).on("click", "button.submit", function (e) {
          e.preventDefault();
          $("button.submit").addClass("is-hidden");
          document
            .querySelectorAll(".tile.is-horizontal")
            .forEach((tile, index) => {
              tile.classList.remove("is-hidden");
              const x = (index % 3) * 100; // example x-coordinate
              const y = Math.floor(index / 3) * 100; // example y-coordinate
              const iX = (y / 100) * 3;
              const iY = x / 100;
              tile.style.transform = "translate(-50%, -50%)";
            });
        });
        $(document).on("click", "button.open", function (e) {
            e.preventDefault();

        })
        //   moveToCenter()
        //   console.log(results);
          console.log(item);
          
        });
      } else {
        console.error("Error fetching nearby places:", status);
      }
    });
  }

  // //   const isOpenNow = place.opening_hours.isOpen();
  //   if (isOpenNow) {
  //     console.log("The place is open now");
  //   }
  //   function displayPlaces(places) {
  //     // places.preventDefault();
  //     // var placesList = document.getElementById('placesList');
  //     // placesList.innerHTML = ''; // Clear previous results

  //     places.forEach(function (place) {
  //       var createEventTableHTML = `

  //             <tr class="card-content is-flex-wrap-wrap">
  //                 <td>${place.name}</td>
  //                 <td>${place.vicinity}</td>
  //                 <td>${place.rating}</td>
  //                 <td class="level-right"><button class="button is-small is-primary add club" data-place='${JSON.stringify(
  //                   place
  //                 ).replace(/'/g, "&apos;")}'>Add To Plan</button></td>
  //             </tr>`;

  //       var $clubRow = $("#clubs").append(createEventTableHTML);
  //       $clubRow.find(".add").data("place", place);
  //     });
  //   }

  //INIT MAP
  async function initMap(position, json) {
    var location = new google.maps.LatLng(
      Math.round(gloablLat),
      Math.round(globalLon)
    );
    console.log(location);
    var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, {
      center: { lat: Math.round(gloablLat), lng: Math.round(globalLon) },
      zoom: 11,
    });

    const { LatLng } = await google.maps.importLibrary("core");

    var request = {
      location: location,
      radius: "1000",
      query: [
        `concert hall in ${userCity}`,
        `music venue in ${userCity}`,
        `stadium in ${userCity}`,
        `arena in ${userCity}`,
        `amphitheater in ${userCity}`,
        `live music in ${userCity}`,
      ].join(", "),
      types: ["concert_hall", "music_venue"].join(", "),
      fields: ["name", "photos"],
    };
    console.log(request);
    service = new google.maps.places.PlacesService(map);
    infowindow = new google.maps.InfoWindow();
    service.textSearch(request, callback);

    for (var i = 0; i < json.page.size; i++) {
      addMarker(map, json._embedded.events[i]);
    }
  }

  //CALLBACK FUNCTION
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
        createPhotoMarker(results[i]);
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
      position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", function () {
      infowindow.setContent(place.name || "");
      infowindow.open(map);
    });
  }

  function createPhotoMarker(place) {
    var photos = place.photos;
    if (!photos) {
      return;
    }

    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name,
      icon: photos[0].getUrl({ maxWidth: 35, maxHeight: 35 }),
    });
  }

  window.initMap = initMap;

  function addMarker(map, event) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        event._embedded.venues[0].location.latitude,
        event._embedded.venues[0].location.longitude
      ),
      map: map,
    });
    marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
    console.log(marker);
  }

  showPosition();
});



//192.168.1.12
// google maps key: AIzaSyCj3wvLnBaKeIBdhCqaNrp14KyEq9KB1pY
