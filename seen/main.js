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
    //temperature: L.featureGroup(),
}
// Hintergrundlayer
let layerControl = L.control.layers({
    "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau", {minZoom: 11}),
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap", {minZoom: 11}).addTo(map),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto", {minZoom: 11}),
}, {
    "Badeseen": themaLayer.badeseen.addTo(map),
    //"Temperatur": themaLayer.temperature,
}).addTo(map);
layerControl.expand(); //Layer immer offen, muss nicht mehr mit einem Klick geöffnet werden
// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);
// PlugIn Hash
let hash = new L.Hash(map);
function getColor(value, ramp){
    for(let rule of ramp) {
        if(value >= rule.min && value < rule.max){
            return rule.color;
        }
    }
}
/*function writeTemperatureLayer(jsondata){
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
*/

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

async function showBadeseen (url){
    let response = await fetch (url);
    let jsondata = await response.json ();
    L.geoJSON(jsondata, {
        pointToLayer: function (feature, latlng) {
            return L.marker (latlng, {
                icon: L.icon({

                    iconUrl: "swim.png",
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                })
            });
        },
        onEachFeature: function (feature, layer) {
            let prop = feature.properties;
            layer.bindPopup (`
            <h4>${prop.NAME}</h4>
            <br>
            <img src="${prop.NAME}.jpg" style = "width:150px", class= "center"></img>
            <br>
            <ul> 
            <li>Wassertemperatur in °C: ${prop.WASSERTEMP||"keine Angabe"}</li>
            <li>Wasserqualität: ${prop.WASSERQUAL||"keine Angabe"}</li>
            </ul>
        `);
    }
}).addTo(themaLayer.badeseen);
}
showBadeseen ("see.geoJson");


/*function showBadeseen(jsondata) {
    // Badeseen bearbeiten
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
                layer.bindPopup(`      
                <h4>${prop.BADEGEWÄSSERNAME}</h4>
                <ul>
                <li>Lufttemperatur (°C): ${prop.LT||"keine Angabe"}</li>
                <li>Wassertemperatur (°C): ${prop.W||"keine Angabe"}</li>
                <li>Wasserqualität: ${prop.A||"keine Angabe"}</li>
                </ul>
                <span>${pointInTime.toLocaleString()}</span>
                `);
            }
        }).addTo(themaLayer.badeseen); //alle Badeseen anzeigen als Marker
        }
        async function loadBadeseen (url) {
            let response = await fetch(url); //Anfrage, Antwort kommt zurück
            let jsondata = await response.json(); //json Daten aus Response entnehmen
            writeBadeseenLayer(jsondata);
        }
        showBadeseen ("badeseen.json");*/