let innsbruck = {
    lat: 47.267222,
    lng: 11.392778,
};

// Karte initialisieren
let map = L.map ("map", {fullscreenControl: true
}).setView([innsbruck.lat, innsbruck.lng], 12);


let osm = L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);


// thematische Layer
let themaLayer = {
    wind: L.featureGroup(),
    huetten: L.markerClusterGroup({disableClusteringAtZoom: 17}),
}

// Hintergrundlayer
let layerControl = L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery").addTo(map)
}, {
"ECMWF Windlayer": themaLayer.wind,
"Hütten": themaLayer.huetten.addTo(map),
}).addTo(map);

//Maßstab
L.control.scale ({
   imperial:false, 
}).addTo(map);


// Winddaten laden
async function loadWind(url) {
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata);

 L.velocityLayer({
    displayValues: true,
    lineWidth: 3,
    displayOptions: {
      velocityType: "",
      position: "bottomright",
      emptyString: "keine Daten vorhanden",
      speedUnit: "k/h",
      directionString: "Windrichtung",
      speedString: "Windgeschwindigkeit",
    },
    data: jsondata, 
  }).addTo(themaLayer.wind);
}
  loadWind("https://geographie.uibk.ac.at/data/ecmwf/data/wind-10u-10v-europe.json");

// rainviewer
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


//Hütten
async function showHuetten(url) {
  let response = await fetch(url); //Anfrage, Antwort kommt zurück
  let jsondata = await response.json(); //json Daten aus Response entnehmen 
  L.geoJSON(jsondata, {
      pointToLayer: function(feature, latlng) {
          console.log(feature.properties)
          return L.marker(latlng, {
              icon: L.icon({
                  iconUrl: "almen/icons/alm.png",
                  iconAnchor: [16, 37],
                  popupAnchor: [0, -37],
              })
          });
      },
      }
  ).addTo(themaLayer.huetten); //alle Busstopps anzeigen als Marker
}
showHuetten ("almen/huetten_json.geojson"); //aufrufen der Funktion 
