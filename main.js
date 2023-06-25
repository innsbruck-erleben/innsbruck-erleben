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
    temperature: L.featureGroup(),
}

// Hintergrundlayer
let layerControl = L.control.layers({
  "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau", {minZoom: 11}),
  "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap", {minZoom: 11}).addTo(map),
  "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto", {minZoom: 11}),
}, {
"ECMWF Windlayer": themaLayer.wind.addTo(map),
"Temperatur": themaLayer.temperature.addTo(map),
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

function getColor(value, ramp) { //value = temperatur, ramp= Colorramp
  for(let rule of ramp){ //rule wird dann überprüft ob sie zwischen min und max ist
         if (value >= rule.min && value < rule.max){
             return rule.color;
         }
     }
 }

//Temperatur
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
