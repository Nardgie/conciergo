// Function to test Geolocation API
function testGeolocationAPI() {
  var apiKey = 'eb42bfdeb6484d1a8511cbf604661531';
  var apiEndpoint = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + apiKey;

  fetch(apiEndpoint)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log('Geolocation API Response:', data);
      var city = data.city;
      var country = data.country;
      var ipAddress = data.ip_address;
      alert('You are located in ' + city + ', ' + country + '. Your IP address is ' + ipAddress);
    })
    .catch(function(error) {
      console.error('Error fetching geolocation data:', error);
      alert('Error fetching geolocation data. Please try again.');
    });
}

// Function to test Ticketmaster API
function testTicketmasterAPI() {
  var apiKey = document.getElementById('apiKeyInput').value;
  var apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + apiKey;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log('Ticketmaster API Response:', data);
      // Process and display the results on your webpage
    })
    .catch(error => {
      console.error('Error fetching Ticketmaster data:', error);
      alert('Error fetching Ticketmaster data. Please try again.');
    });
}

// Function to get user location and fetch tickets
function getUserLocationAndFetchTickets() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
      fetchTickets(latitude, longitude);
    }, function(error) {
      console.error('Error getting geolocation:', error.message);
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}

// Function to fetch tickets using latitude and longitude
function fetchTickets(latitude, longitude) {
  var apiKey = 'DUgo2if0GRISfmK8CVNbZMuc2NAlxRiE';
  var apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + apiKey + '&latlong=' + latitude + ',' + longitude;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log('Ticketmaster API Response:', data);
      // Process the API response and display ticket information
      displayTicketResults(data._embedded.events);
    })
    .catch(error => console.error('Error fetching data from Ticketmaster API:', error));
}

// Function to display ticket results in the DOM
function displayTicketResults(events) {
  var ticketResultsDiv = document.getElementById('ticketResults');
  ticketResultsDiv.innerHTML = ''; // Clear previous results

  events.forEach(function(event) {
    var eventDiv = document.createElement('div');
    eventDiv.innerHTML = '<h2>' + event.name + '</h2>' +
      '<p>' + event.dates.start.localDate + '</p>' +
      '<p>' + event._embedded.venues[0].name + ', ' + event._embedded.venues[0].city.name + '</p>' +
      '<p>' + event.url + '</p>' +
      '<hr>';
    ticketResultsDiv.appendChild(eventDiv);
  });
}
