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
}

// Hintergrundlayer
let layerControl = L.control.layers({
    "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau", {minZoom: 11}),
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap", {minZoom: 11}).addTo(map),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto", {minZoom: 11}),
}, {
    "Badeseen": themaLayer.badeseen.addTo(map),
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
                <ul>
                <li>Wassertemperatur in °C: ${prop.WASSERTEMP||"keine Angabe"}</li>
                <li>Wasserqualität: ${prop.WASSERQUAL||"keine Angabe"}</li>
                </ul>
            `);
        }
    }).addTo(themaLayer.badeseen);
}
showBadeseen ("see.geoJson");
        