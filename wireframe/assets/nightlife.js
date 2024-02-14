
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

    const d = R * c; 
    const dInMiles = d / 1609.34; 
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
