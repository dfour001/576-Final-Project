// Main Map
var map = L.map('editMap', {zoomControl:false}).setView([37.54, -77.43], 13);
new L.Control.Zoom({ position: 'topright' }).addTo(map);

var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map);


// Image Form Map
var imgMap = L.map('editFormMap', {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false
}).setView([37.54, -77.43], 13);

var Stamen_TonerLite2 = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(imgMap);

// Image form marker
var cameraIcon = L.icon({
    iconUrl: '../img/camera.png',
    iconSize: [30,30],
    iconAnchor: [15,15]
});

var imgMapMarker = L.marker([0,0], {icon: cameraIcon}).addTo(imgMap);