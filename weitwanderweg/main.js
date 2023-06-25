/* Innsbruck Trek Tirol Beispiel */

// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let map = L.map("map", {
    fullscreenControl: true, minZoom: 8,
}).setView([ibk.lat, ibk.lng], 10);


// WMTS Hintergrundlayer der eGrundkarte Tirol definieren
let eGrundkarteTirol = {
    sommer: L.tileLayer("https://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png", {
        attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
    }),
    ortho: L.tileLayer("https://wmts.kartetirol.at/gdi_ortho/{z}/{x}/{y}.png", {
        attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
    }
    ),
    nomenklatur: L.tileLayer("https://wmts.kartetirol.at/gdi_nomenklatur/{z}/{x}/{y}.png", {
        attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`,
        pane: "overlayPane",
    })
}

// Hintergrundlayer eGrundkarte Tirol mit GPX overlay
let layerControl = L.control.layers({
    "eGrundkarte Tirol Sommer": L.layerGroup([
        eGrundkarteTirol.sommer,
        eGrundkarteTirol.nomenklatur
    ]).addTo(map),
    "eGrundkarte Tirol Orthofoto": L.layerGroup([
        eGrundkarteTirol.ortho,
        eGrundkarteTirol.nomenklatur,
    ])
}, {
   
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

//GPX Track visualisieren



let controlElevation_T1 = L.control.elevation({
    time: false,
    elevationDiv: "#profile",
    height: 300,
    theme: "lime-theme",
    autofitBounds: false,
    collapsed: true
}).addTo(map);
controlElevation_T1.load("./data/Tag 1_Innsbruck_Rauschbrunnen.gpx");

let controlElevation_T2 = L.control.elevation({
    time: false,
    elevationDiv: "#profile",
    height: 300,
    theme: "lime-theme",
    autofitBounds: false,
    collapsed: true
}).addTo(map);
controlElevation_T2.load("./data/Tag 2_Wankspitze.gpx");

let controlElevation_T3 = L.control.elevation({
    time: false,
    elevationDiv: "#profile",
    height: 300,
    theme: "lime-theme",
    autofitBounds: false,
    collapsed: true
}).addTo(map);
controlElevation_T3.load("./data/Tag 3_Pirchkogel.gpx");

let controlElevation_T4 = L.control.elevation({
    time: false,
    elevationDiv: "#profile",
    height: 300,
    theme: "lime-theme",
    autofitBounds: false,
    collapsed: true
}).addTo(map);
controlElevation_T4.load("./data/Tag 4_Sellraintaler_Höhenwanderweg.gpx");

let controlElevation_T5 = L.control.elevation({
    time: false,
    elevationDiv: "#profile",
    height: 300,
    theme: "lime-theme",
    autofitBounds: false,
    collapsed: true
}).addTo(map);
controlElevation_T5.load("./data/Tag 5_Birgitzköpfl.gpx");

let controlElevation_T6 = L.control.elevation({
    time: false,
    elevationDiv: "#profile",
    height: 300,
    theme: "lime-theme",
    autofitBounds: false,
    collapsed: true
}).addTo(map);
controlElevation_T6.load("./data/Tag 6_Patscherkofel_Viggarspitze.gpx");