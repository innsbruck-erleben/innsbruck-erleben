/* Hütten rund um Innsbruck */

// Koordinaten Innsbruck
let innsbruck = {
    lat: 47.267222,
    lng: 11.392778,
};

// Karte initialisieren
let map = L.map("map").setView([
    innsbruck.lat, innsbruck.lng
], 11);

map.addControl(new L.Control.Fullscreen({
    title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
    }
}));

// PlugIn Hash
let hash = new L.Hash(map);

//thematische Layer 
let themaLayer = {
    huetten: L.markerClusterGroup({disableClusteringAtZoom: 17
            }),
}


// Hintergrundlayer
let layerControl = L.control.layers({
    "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau", {minZoom: 11}),
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap", {minZoom: 11}).addTo(map),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto", {minZoom: 11}),
}, {
    "Hütten": themaLayer.huetten.addTo(map),
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

//Hütten
async function showHuetten (url) {
    let response = await fetch(url); //Anfrage, Antwort kommt zurück
    let jsondata = await response.json(); //json Daten aus Response entnehmen 
    L.geoJSON(jsondata, {
        pointToLayer: function(feature, latlng) {
            //console.log(feature.properties)
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/alm.png",
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                })
            });
        },
        onEachFeature: function (feature, layer) {
            let prop = feature.properties;
            layer.bindPopup(`      
            <h4> ${prop.NAME} auf ${prop.SEEHOEHE} m Höhe</h4>
            <br>
            <img src="${prop.NAME}.jpg" style = "width:150px", class= "center"></img>
            <br>
            <b>Betreiber:</b> ${prop.BETREIBER} <br>
            <b>geöffnete Monate: </b> ${prop.OFFEN} <br>
            <b>Übernachtungsmöglichkeiten: </b>${prop.UEBERNACHTUNG} <br>
            <a href="${prop.HOMEPAGE}">${prop.HOMEPAGE}</a> <br>        
            `);
        }
    }).addTo(themaLayer.huetten); //alle Almen anzeigen als Marker
}
showHuetten ("huetten_json.geojson");


