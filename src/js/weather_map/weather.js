const apiKey = '5be9748e895644479de152835251904'; 

const cities = [
    { name: "New York", coords: [42.992232, -90.537378] },
    { name: "Buffalo", coords: [42.8864, -78.8784] },
    { name: "Rochester", coords: [43.1566, -77.6088] },
    { name: "Albany", coords: [42.6526, -73.7562] },
    { name: "Syracuse", coords: [43.0481, -76.1474] },
    { name: "Binghamton", coords: [42.0987, -75.9180] },
    { name: "Ithaca", coords: [42.4430, -76.5019] },
    { name: "Utica", coords: [43.1009, -75.2327] },
    { name: "Schenectady", coords: [42.8142, -73.9396] },
  ];

const map = L.map('map').setView(cities[2].coords, 6); 

const redIcon = L.icon({
    iconUrl: "src/js/weather_map/icon.png",
    iconSize: [32, 42],
    iconAnchor:[32, 42],
    popupAnchor: [0, -42]
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Made by NaniDude'
}).addTo(map);
let markers = [];
cities.forEach((e) => markers.push(L.marker(e.coords, {icon: redIcon}).addTo(map)));

//let NewYorkMarker = L.marker(NewYork, {icon: redIcon}).addTo(map);

//NewYorkMarker.on('click', function () {
//    fetchWeather(NewYork[0], NewYork[1]);
//});

let WeatherMarker;

map.on('click', function (e) {
    const { lat, lng } = e.latlng;

    if (WeatherMarker) map.removeLayer(WeatherMarker);
    WeatherMarker = L.marker([lat, lng]).addTo(map);
    fetchWeather(lat, lng, WeatherMarker);
});

function fetchWeather(lat, lon, marker) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&lang=en`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const info = data.current;
            
            document.getElementById("weather").innerHTML = `
          <h3>📍 ${data.location.name}, ${data.location.country}</h3>
          <p>🌡️ Temperature: ${info.temp_c}°C</p>
          <p>🌥️ Description: ${info.condition.text}</p>
          <p>💨 Wind: ${info.wind_kph} km/h</p>
          <p>💧 Humidity: ${info.humidity}%</p>
        `;
        })
        .catch(err => {
            console.error(err);});
}
