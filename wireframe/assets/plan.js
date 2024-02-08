// Setting it up so that if a user event is selected, it will show up on the top
// Still Working on that logic
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

    // Function to update the page with the selected event
    function updateSelectedEvent(event) {
        var eventNameElement = document.getElementById('eventName');
        eventNameElement.textContent = event.name;
        var eventDateElement = document.getElementById('eventDate');
        eventDateElement.textContent = event.date;
        var eventLocationElement = document.getElementById('eventLocation');
        eventLocationElement.textContent = event.location;
        // Additional event details can be updated here
    }

    // Function to fetch nearby restaurants and bars
    async function fetchNearbyPlaces(location) {
        try {
            // Make API request to fetch nearby places based on location
            var response = await fetch(`https://api.example.com/places?location=${location}`);
            var data = await response.json();
            displayNearbyPlaces(data);
        } catch (error) {
            console.error('Error fetching nearby places:', error);
        }
    }

    // Function to display nearby restaurants and bars
    function displayNearbyPlaces(places) {
        var restaurantList = document.getElementById('restaurantList');
        restaurantList.innerHTML = ''; // Clear previous results
        // Iterate over places and create HTML elements to display them
        places.forEach(place => {
            var placeElement = document.createElement('div');
            placeElement.classList.add('place');
            placeElement.innerHTML = `
                <h3>${place.name}</h3>
                <p>${place.address}</p>
            `;
            restaurantList.appendChild(placeElement);
        });
    }

    // Initial setup: Assuming user has already selected an event
    var selectedEvent = {
        name: 'Selected Event Name',
        date: 'Selected Event Date',
        location: 'Selected Event Location'
    };
    updateSelectedEvent(selectedEvent);
    fetchNearbyPlaces(selectedEvent.location);
});

// Define variables for event form and nearby restaurants list
var eventForm = document.getElementById('eventForm');
var restaurantList = document.getElementById('restaurantList');

// Function to fetch nearby restaurants and bars
function fetchNearbyPlaces() {
    // implement the logic here to fetch nearby places using APIs
    // Iterate through fetched places and create HTML elements to display them
    nearbyPlaces.forEach(function(place) {
        var placeElement = document.createElement('div');
        placeElement.classList.add('place');

        var nameElement = document.createElement('p');
        nameElement.textContent = place.name;
        placeElement.appendChild(nameElement);

        var distanceElement = document.createElement('p');
        distanceElement.textContent = 'Distance: ' + place.distance;
        placeElement.appendChild(distanceElement);

        var ratingElement = document.createElement('p');
        ratingElement.textContent = 'Rating: ' + place.rating;
        placeElement.appendChild(ratingElement);

        restaurantList.appendChild(placeElement);
    });
}

// Event listener for form submission
eventForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    fetchNearbyPlaces(); // Fetch nearby places when form is submitted
});



