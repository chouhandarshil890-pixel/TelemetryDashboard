const socket = io();

const map = L.map('map').setView([22.9734, 78.6569], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add your teammates' cities here
const cityCoords = {
    "Ratlam": [23.3315, 75.0367],
    "Nashik": [19.987477, 73.768667],
    "Dilli": [28.7041, 77.1025]
};

const markers = {};
const rows = {};
const tableBody = document.getElementById('tableBody');

socket.on('telemetry', (data) => {
    console.log('Received:', data);

    if (!rows[data.node]) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${data.node}</td><td>${data.city.trim()}</td><td>${data.temperature}</td><td>${data.humidity}</td><td>${data.rf_noise}</td>`;
        tableBody.appendChild(row);
        rows[data.node] = row;
    } else {
        rows[data.node].children[2].textContent = data.temperature;
        rows[data.node].children[3].textContent = data.humidity;
        rows[data.node].children[4].textContent = data.rf_noise;
    }

    const coords = cityCoords[data.city.trim()];
    if (coords) {
        if (!markers[data.node]) {
            markers[data.node] = L.marker(coords).addTo(map);
        }
        markers[data.node].bindPopup(
            `<div class="leaflet-popup-content"><b>${data.node}</b><br>${data.city}<br>${data.temperature}°C, ${data.humidity}%</div>`
        );
    }
});