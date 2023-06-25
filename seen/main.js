/* Badeseen und Wetter rund um Innsbruck */

// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let map = L.map("map", {
    fullscreenControl: true, minZoom: 11,
}).setView([ibk.lat, ibk.lng], 11);

// thematische Layer
let themaLayer = {
    badeseen: L.featureGroup(),
    temperature: L.featureGroup(),
}

// Hintergrundlayer
let layerControl = L.control.layers({
    "Relief avalanche.report": L.tileLayer(
        "https://static.avalanche.report/tms/{z}/{x}/{y}.webp", {
        attribution: `© <a href="https://lawinen.report">CC BY avalanche.report</a>`, minZoom: 11,
    }).addTo(map),
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery")
}, {
    "Badeseen": themaLayer.badeseen.addTo(map),
    "Temperatur": themaLayer.temperature,
}).addTo(map);

layerControl.expand(); //Layer immer offen, muss nicht mehr mit einem Klick geöffnet werden

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

function getColor(value, ramp){
    for(let rule of ramp) {
        if(value >= rule.min && value < rule.max){
            return rule.color;
        }
    }
}

function writeTemperatureLayer(jsondata){
    L.geoJSON(jsondata,{
        filter: function(feature){
            if (feature.properties.LT > -50 && feature.properties.LT < 50) {
                return true;
            }
        },
        pointToLayer: function(feature, latlng) {
            let color = getColor(feature.properties.LT, COLORS.temperature);
            return L.marker(latlng, {
                icon: L.divIcon({
                    className: "aws-div-icon",
                    html: `<span style="background-color:${color}">${feature.properties.LT.toFixed(1)}</span>`
                })
            });
        },
    }).addTo(themaLayer.temperature);
}

async function loadTemperature (url) {
    let response = await fetch(url); //Anfrage, Antwort kommt zurück
    let jsondata = await response.json(); //json Daten aus Response entnehmen
    writeTemperatureLayer(jsondata);
}

loadTemperature("https://static.avalanche.report/weather_stations/stations.geojson");

L.control.rainviewer({ 
    position: 'bottomleft',
    nextButtonText: '>',
    playStopButtonText: 'Play/Stop',
    prevButtonText: '<',
    positionSliderLabelText: "Hour:",
    opacitySliderLabelText: "Opacity:",
    animationInterval: 500,
    opacity: 0.5
}).addTo(map);

function writeSBadeseenLayer(jsondata) {
    // Wetterstationen bearbeiten
    L.geoJSON(jsondata, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icon\swim.png`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                })
            });
        },
    
            onEachFeature: function (feature, layer) {
                let prop = feature.properties; //Variable damit kürzer; * steht als Platzhalter für Bildunterschrift, Link für Infos, nur 1 Tab für Links
                let höhenmeter = feature.geometry.coordinates;
                let pointInTime = new Date(prop.date);
                console.log(pointInTime);
                layer.bindPopup(`      
                <h4>${prop.BADEGEWÄSSERNAME}</h4>
                <ul>
                <li>Lufttemperatur (°C): ${prop.LT||"keine Angabe"}</li>
                <li>Wassertemperatur (°C): ${prop.W||"keine Angabe"}</li>
                <li>Wasserqualität: ${prop.A||+"keine Angabe"}</li>
                <li>Schneehöhe (cm): ${prop.HS||"keine Angabe"}</li>
                <li>Regen (mm/m²): ${prop.R||"keine Angabe"}</li>
                </ul>
                <span>${pointInTime.toLocaleString()}</span> 
                `);
            }
        }).addTo(themaLayer.stations); //alle Wetterstationen anzeigen als Marker
        }