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



