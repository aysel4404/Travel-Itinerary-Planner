let map;
let markers = [];

/* INITIALIZE MAP */

function initMap(){

map = L.map('map').setView([20.5937,78.9629],5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:19
}).addTo(map);

}

initMap();


/* CLEAR OLD MARKERS */

function clearMarkers(){

markers.forEach(m => map.removeLayer(m));
markers = [];

}


/* MAIN BUTTON FUNCTION */

function generatePlan(){

const city = document.getElementById("city").value;
const days = parseInt(document.getElementById("days").value);
const interest = document.getElementById("interest").value;

if(!city || !days){
alert("Please enter city and days");
return;
}

searchCity(city,days,interest);

}


/* SEARCH CITY COORDINATES */

function searchCity(city,days,interest){

fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)

.then(res=>res.json())

.then(data=>{

if(data.length===0){
alert("City not found");
return;
}

const lat = parseFloat(data[0].lat);
const lon = parseFloat(data[0].lon);

map.setView([lat,lon],13);

clearMarkers();

getTouristPlaces(lat,lon,days,interest);

});

}


/* GET TOURIST PLACES */

function getTouristPlaces(lat, lon, days, interest){

let query = "";

if(interest === "food"){

query = `
[out:json];
(
node["amenity"="restaurant"](around:10000,${lat},${lon});
node["amenity"="cafe"](around:10000,${lat},${lon});
node["amenity"="fast_food"](around:10000,${lat},${lon});
);
out body;
`;

}

else if(interest === "nature"){

query = `
[out:json];
(
node["natural"](around:10000,${lat},${lon});
node["leisure"="park"](around:10000,${lat},${lon});
node["tourism"="viewpoint"](around:10000,${lat},${lon});
);
out body;
`;

}

else if(interest === "culture"){

query = `
[out:json];
(
node["tourism"="museum"](around:10000,${lat},${lon});
node["historic"](around:10000,${lat},${lon});
node["tourism"="attraction"](around:10000,${lat},${lon});
);
out body;
`;

}

else{

query = `
[out:json];
(
node["tourism"="attraction"](around:10000,${lat},${lon});
node["tourism"="museum"](around:10000,${lat},${lon});
node["tourism"="viewpoint"](around:10000,${lat},${lon});
node["historic"](around:10000,${lat},${lon});
node["leisure"="park"](around:10000,${lat},${lon});
);
out body;
`;

}


/* FETCH DATA */

fetch("https://overpass-api.de/api/interpreter",{
method:"POST",
body:query
})
.then(res=>res.json())

.then(data=>{

const places = [];

data.elements.forEach(place=>{

if(!place.tags || !place.tags.name) return;

const name = place.tags.name;
const placeLat = place.lat;
const placeLon = place.lon;


/* SCORING SYSTEM */

let score = 1;

if(place.tags.tourism==="attraction") score=5;
if(place.tags.tourism==="museum") score=4;
if(place.tags.historic) score=4;
if(place.tags.tourism==="viewpoint") score=3;
if(place.tags.amenity==="restaurant") score=4;
if(place.tags.amenity==="cafe") score=3;


/* SAVE PLACE */

places.push({
name:name,
lat:placeLat,
lon:placeLon,
score:score
});


/* ADD MARKER */

const marker = L.marker([placeLat,placeLon])
.addTo(map)
.bindPopup(name);

markers.push(marker);

});


generateItinerary(places,days,interest);

});

}


/* DISTANCE FUNCTION */

function distance(a,b){

return Math.sqrt(
Math.pow(a.lat-b.lat,2) +
Math.pow(a.lon-b.lon,2)
)

}


/* SMART ITINERARY */

function generateItinerary(places,days,interest){

const result = document.getElementById("result");

result.innerHTML = "";


/* SORT BY FAMOUS SCORE */

places.sort((a,b)=>b.score-a.score);

let remaining=[...places];


/* FOOD LIMIT */

const maxPerDay = interest === "food" ? 4 : 5;


for(let d=1; d<=days; d++){

if(remaining.length===0) break;

let card=document.createElement("div");
card.className="day-card";

let html=`<h3>📅 Day ${d}</h3>`;
html+="<div class='places-container'>";


/* MOST FAMOUS PLACE FIRST */

let current=remaining.shift();

html+=`<div class="place-card">📍 ${current.name}</div>`;

let dayPlaces=[current];


/* FIND NEARBY PLACES */

for(let i=remaining.length-1;i>=0;i--){

let place=remaining[i];

let close=dayPlaces.some(p=>distance(p,place)<0.03);

if(close && dayPlaces.length<maxPerDay){

html+=`<div class="place-card">📍 ${place.name}</div>`;

dayPlaces.push(place);

remaining.splice(i,1);

}

}


html+="</div>";

card.innerHTML=html;

result.appendChild(card);

}

}