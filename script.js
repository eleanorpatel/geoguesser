/*const PLACES = [
    {
       name: "Bangkok, Thailand",
       lat: "13.7563",
       lng: "100.5018",
       country: "Thailand",
       continent: "Asia",
       climate: "Tropical",
       drivingSide: "Left",
       language: "Thai",
       timezone: "UTC +7",
       coast: "False", 
    },
    {
        name: "Reykjavík, Iceland",
        lat: 64.1466,
        lng: -21.9426,
        country: "Iceland",
        continent: "Europe",
        climate: "Subpolar oceanic",
        drivingSide: "Right",
        language: "Icelandic",
        timezone: "UTC+0",
        coast: true
    },
    {
        name: "Nairobi, Kenya",
        lat: -1.2921,
        lng: 36.8219,
        country: "Kenya",
        continent: "Africa",
        climate: "Subtropical highland",
        drivingSide: "Left",
        language: "Swahili / English",
        timezone: "UTC+3",
        coast: false
    },
    {
        name: "Lima, Peru",
        lat: -12.0464,
        lng: -77.0428,
        country: "Peru",
        continent: "South America",
        climate: "Desert (coastal)",
        drivingSide: "Right",
        language: "Spanish",
        timezone: "UTC-5",
        coast: true
    },  
    {
        name: "Sydney, Australia",
        lat: -33.8688,
        lng: 151.2093,
        country: "Australia",
        continent: "Oceania",
        climate: "Humid subtropical",
        drivingSide: "Left",
        language: "English",
        timezone: "UTC+10",
        coast: true
    }
]; */

async function fetchRound(){
    const res = await fetch("")
    return await res.json
}

let map;
let answer = null;
let guessMarker = null;
let answerMarker = null;
let line = null;
let roundLocked = false;

const hints = document.getElementById("hints")
const errorKm = document.getElementById("errorKm")
const score = document.getElementById("score")

document.getElementById("newRoundBtn").addEventListener("click", newRound);
document.getElementById("revealBtn").addEventListener("click", revealAnswer);

initMap()
newRound()

function initMap(){
    map = L.map ("map", {worldCopyJump: true}).setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    map.on("click", (e) => {
        if (roundLocked) return;
        placeGuess (e.latlng)
    })    
}

async function newRound(){
    roundLocked = false;
    clearRoundVisuals();
    const data = await fetchRound();
    answer = data.answer renderHintsFromBackEnd(data.hints);
    errorKm.textContent = "-";
    score.textContent = "-";
}
function renderHintsFromBackend(h) {
  const hints = [
    `Hemisphere: <span>${h.hemisphere}</span>`,
    `Latitude band: <span>${h.latitude_band}</span>`,
    `Approx. timezone: <span>${h.timezone_approx}</span>`,
    `Distance to equator: <span>${h.distance_to_equator_km} km</span>`
  ];

  hintsEl.innerHTML = hints.map(x => `<li>${x}</li>`).join("");
}

function placeGuess(latlng){
    if (guessMarker) guessMarker.remove();
    guessMarker = L.marker([latlng.lat, latlng.lng]).addTo(map).bindPopup("Your Guess").openPopup();
    finalizeRound(latlng);
}

function clearRoundVisuals(){
    if (guessMarker) {guessMarker.remove(); guessMarker = null;}
    if (answerMarker) {answerMarker.remove(); answerMarker = null;}
    if (line) {line.remove(); line = null;}
}

function revealAnswer(){
    if (!answer)
        return;
    if (!answerMarker){
        answerMarker = L.marker([answer.lat, answer.lng]).addTo(map).bindPopup(`Answer:${answer.name}`).openPopup();
        map.panto([answer.lat, answer.lng]);
    }
    else {answerMarker.openPopup}
}

function finalizeRound(guessLatLng){
    roundLocked = true
    const ansLatLng = L.latLng(answer.lat, answer.lng);
    const km = hskilometers(guessLatLng.lat, guessLatLng.lng, ansLatLng.lat, ansLatLng.lng);
    const kmrounded = Math.round(km);
    errorKm.textcontent = `${kmrounded.toLocaleString()}km`;
    const score = Math.max(0, Math.round(5000* Math.exp(-km/2000)));
    score.textcontent = score.toLocaleString();
    answerMarker = L.marker([answer.lat, answer.lng])
        .addTo(map)
        .bindPopup(`Actual Location`)
    line = L.polyline([guessLatLng, ansLatLng]).addTo(map);
}

function hskilometers(lat1, lon1, lat2, lon2){
    const R = 6371;
    const toRad = (d) => (d * Math.PI) /180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat/2) **2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon /2) **2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}
