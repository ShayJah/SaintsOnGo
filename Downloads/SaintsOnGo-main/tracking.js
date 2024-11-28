document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map with default coordinates (e.g., for London)
    var map = L.map('map').setView([51.505, -0.09], 13);

    // Add the OpenStreetMap tiles to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker (example)
    L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('A sample bus stop.')
        .openPopup();
});
