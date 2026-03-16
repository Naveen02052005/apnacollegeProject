// const apiKey = mapToken;
//             var map = L.map('map').setView([17.3850, 78.4867], 10);

//             L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
//             attribution:'© OpenStreetMap contributors'
//             }).addTo(map);

//             // OpenRouteService requires [longitude, latitude]
//             // const start = [78.4747,17.3616];
//             // const end = [78.3772,17.4435];

//             fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`)
//             .then(res=>res.json())
//             .then(data=>{

//             const coords = data.features[0].geometry.coordinates;

//             // convert [lng,lat] → [lat,lng] for Leaflet
//             const route = coords.map(c => [c[1],c[0]]);

//             L.polyline(route,{color:'blue',weight:5}).addTo(map);

// });


const apiKey = mapToken;
const start = listing.geometry.coordinates; // [lng, lat]

var map = L.map('map').setView([start[1], start[0]], 10); // 10 is zoom

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'© OpenStreetMap contributors'
}).addTo(map);

// Custom red icon
const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Add marker
const marker = L.marker([start[1], start[0]], {icon: redIcon})
    .addTo(map);

// Bind popup with coordinates or custom message
marker.bindPopup(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`);

// Show popup on hover
marker.on('mouseover', function() {
    this.openPopup();
});
marker.on('mouseout', function() {
    this.closePopup();
});