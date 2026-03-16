index.html:
----------
<!doctype html>
<html lang="en">
<head>
    <meta charset = "utf-8" />
    <meta name = "viewport" content="width=device-width, initial-scale=1"/>
    <title> HintGuessr </title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <script defer src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <link rel="stylesheet" href="styles.css" />
  <script defer src="script.js"></script>
</head>
<body>
    <header class="topbar">
        <div class="brand"> HintGuessr</div>
        <div class="controls">
            <button id="newRoundBtn"> New Round</button>
            <button id="revealBtn" class="secondary"> Reveal Answer</button>
        </div>
    </header>
    
    <main class="layout">
        <section class="panel">
            <h2>Hints</h2>
            <ol id="hints" class="hints"></ol>
            
            <div class="stats">
                <div><span class="label"> Your error:</span> <span id="errorKm">-</span></div>
                <div><span class="label"> Score: </span><span id="score">-</span></div>
            </div>
            
            <div class="tip">
                Click anywhere on the map to place your guess.
            </div>
        </section>
        
        <section class="mapWrap">
            <div id="map"></div>
        </section>
    </main>
</body>
</html>

script.js:
---------
const PLACES = [
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
];

let map;
let answer = null;
let guessMarker = null;
let answerMarker = null;
let line = null;
let roundLock = false;

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
    map.on(click), (e => {
        if (roundLocked) return;
        placeGuess (e.latlng)
    })    
}

function newRound(){
    roundLock = false;
    clearRoundVisuals();
    answer = PLACES[math.floor(math.random)()*PLACES.length()];
    renderHints(answer);
    errorKm.textContent = "-";
    score.textContent = "-";
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
        answerMarker = L.marker([answer.lat, answer.lng]).addTo(map).bindPopup("Answer:${answer.name").openPopup();
        map.panto([answer.lat, answer.lng]);
    }
    else {answerMarker.openPopup}
}

function finalizeRound(guesslatlng){
    roundLocked = true
    const answerlatlng = L.latlng(answer.lat, answer.lng)
    const kilometers = hskilometers
    const kmrounded = Math.roundkm
    errorKmEL.textcontent = `${kmrounded.toLocaleString()}km`;
    const score = Math.max(0, Math.round(5000* Math.exp(-km/2000)))
    scoreEL.textcontent = score.toLocaleString();
    answerMarker = L.marker([answer.lat, answer.lng]).addTo(map).bindPopup("Answer:${answer.name").openPopup();
    line = L.polyline([guesslatlng, answerlatlng]).addTo(map);
}

function hskilometers(lat1, lon1, lat2, lon2){
    const R = 6371;
    const toRad = (d) => (d * Math.PI) /180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat/2) **2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlon /2) **2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

styles.css:
----------
:root {
  --bg: #0b0f14;
  --panel: #121a24;
  --text: #e7eef7;
  --muted: #9fb3c8;
  --accent: #4aa3ff;
  --border: rgba(255,255,255,0.08);
}

* { box-sizing: border-box; }
html, body { height: 100%; margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; }
body { background: var(--bg); color: var(--text); }

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.brand { font-weight: 800; letter-spacing: 0.2px; }
.controls { display: flex; gap: 10px; }

button {
  border: 1px solid var(--border);
  background: var(--accent);
  color: #06121f;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 650;
}

button.secondary {
  background: transparent;
  color: var(--text);
}

.layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  height: calc(100vh - 57px);
}

.panel {
  padding: 16px;
  background: var(--panel);
  border-right: 1px solid var(--border);
  overflow: auto;
}

.panel h2 { margin: 0 0 10px; }
.hints { margin: 0; padding-left: 20px; color: var(--text); }
.hints li { margin: 8px 0; color: var(--text); }
.hints li span { color: var(--muted); }

.stats {
  margin-top: 14px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(255,255,255,0.03);
}

.label { color: var(--muted); margin-right: 6px; }

.tip {
  margin-top: 14px;
  color: var(--muted);
  font-size: 0.95rem;
}

.mapWrap { height: 100%; 
    
}
#map { width: 100%; height: 100%; }

