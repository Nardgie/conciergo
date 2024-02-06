// // Function to fetch geolocation data
// function fetchGeolocationData(apiKey) {
//     var apiEndpoint = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + apiKey;

//     return fetch(apiEndpoint)
//         .then(function (response) {
//             return response.json();
//         })
//         .catch(function (error) {
//             console.error('Error fetching geolocation data:', error);
//             throw new Error('Error fetching geolocation data. Please try again.');
//         });
// }

// // Function to fetch music events using the entered zipcode
// function fetchEventsByZipcode(apiKey, zipcode) {
//     // Include a 50-mile radius in the Ticketmaster API request
//     var apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + apiKey +
//         '&postalCode=' + zipcode + '&radius=50&unit=miles&classificationName=music';

//     return fetch(apiUrl)
//         .then(function (response) {
//             return response.json();
//         })
//         .catch(function (error) {
//             console.error('Error fetching data from Ticketmaster API:', error);
//             throw new Error('Error fetching data from Ticketmaster API. Please try again.');
//         });
// }

// // Function to display event results in the DOM
// function displayEventResults(events) {
//     var eventResultsDiv = document.getElementById('eventResults');
//     eventResultsDiv.innerHTML = ''; // Clear previous results

//     if (events.length === 0) {
//         eventResultsDiv.innerHTML = '<p>No music events found for the entered zipcode.</p>';
//     } else {
//         events.forEach(function (event) {
//             var eventDiv = document.createElement('div');
//             eventDiv.innerHTML = '<h2>' + event.name + '</h2>' +
//                 '<p>' + event.dates.start.localDate + '</p>' +
//                 '<p>' + event._embedded.venues[0].name + ', ' + event._embedded.venues[0].city.name + '</p>' +
//                 '<p>' + event.url + '</p>' +
//                 '<hr>';
//             eventResultsDiv.appendChild(eventDiv);
//         });
//     }
// }

// // Event listener for the search button
// document.getElementById('searchButton').addEventListener('click', function () {
//     var userZipcode = document.getElementById('zipcodeInput').value;

//     // Validate user input 
//     if (userZipcode && /^[0-9]{5}$/.test(userZipcode)) {
//         var apiKey = 'DUgo2if0GRISfmK8CVNbZMuc2NAlxRiE'; // Replace with your actual API key

//         // Fetch geolocation data and then fetch music events based on the entered zipcode
//         fetchGeolocationData(apiKey)
//             .then(function (geolocationData) {
//                 console.log('Geolocation API Response:', geolocationData);
//                 return fetchEventsByZipcode(apiKey, userZipcode);
//             })
//             .then(function (ticketmasterData) {
//                 console.log('Ticketmaster API Response:', ticketmasterData);
//                 // Process the API responses and display event information
//                 displayEventResults(ticketmasterData._embedded.events);
//             })
//             .catch(function (error) {
//                 alert(error.message);
//             });
//     } else {
//         alert('Invalid or empty zipcode. Please try again.');
//     }
// });


// Replace 'YOUR_API_KEY' with your TomTom API key
var apiKey = 'Az0CcjRjmCUkzBBV4xRK1BwBC7IeHuQI';

// Initialize the map
var map = tt.map({
    key: apiKey,
    container: 'map',
    style: 'tomtom://vector/1/basic-main',
    center: [0, 0], // Default center, will be updated with user's location
    zoom: 15
});

// Get user's geolocation
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            // Update map center to user's location
            map.setCenter([longitude, latitude]);

            // Call the TomTom Parking Availability API
            fetchParkingAvailability([longitude, latitude]);
        },
        function(error) {
            console.error('Error getting geolocation:', error);
        }
    );
} else {
    console.error('Geolocation is not supported by this browser.');
}

// Function to fetch parking availability using TomTom API
function fetchParkingAvailability(location) {
    var apiUrl = 'https://api.tomtom.com/search/2/parkingAvailability/' + location[1] + ',' + location[0] + '.json?key=' + apiKey;

    fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log('Parking Availability API Response:', data);
            // Process and display parking availability data as needed
        })
        .catch(function(error) {
            console.error('Error fetching parking availability data:', error);
        });
}
