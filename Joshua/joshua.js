//this is to test getting the users IP and then use the geolocation api

function testGeolocationAPI() {
    // use api key
    var apiKey = 'eb42bfdeb6484d1a8511cbf604661531';
  
    // API endpoint for geolocation
    var apiEndpoint = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + apiKey;
  
    // Make a request to the API
    fetch(apiEndpoint)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // Log the API response to the console
        console.log('Geolocation API Response:', data);
  
        // use the data to pull specifics
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
  