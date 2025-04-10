// Create the tile layer that will be the background of our map.
var street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map object with center and zoom level.
var myMap = L.map("map", {
    center: [37.09, -95.71], // Center of the US
    zoom: 5
});

// Add the tile layer to the map.
street.addTo(myMap);

// Use this link to get the GeoJSON data.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a function to set marker color based on depth
function getColor(depth) {
    if (depth > 90) return "#c03990";
    else if (depth > 70) return "#f06a3c";
    else if (depth > 50) return "#f1a93d";
    else if (depth > 30) return "#f3f06d";
    else if (depth > 10) return "#62e6c4";
    else return "#a3f0ff";
}

// Create a function to set marker size based on magnitude
function getRadius(magnitude) {
    if (magnitude === 0) return 1;
    return magnitude * 5;
}

// Get the data with d3.
d3.json(url).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: function(feature) {
            return {
                opacity: 1,
                fillOpacity: 0.7,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000000",
                radius: getRadius(feature.properties.mag),
                stroke: true,
                weight: 0.5
            };
        },
        // Binding popups
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: <b>" + feature.properties.mag + 
            "</b><br>Depth: <b>" + feature.geometry.coordinates[2] + 
            " km</b><br>Location: <b>" + feature.properties.place + "</b>");
        }
    }).addTo(myMap);
});

// Add a legend to the map.
var legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [-10, 10, 30, 50, 70, 90];
    var colors = [
        "#a3f0ff",
        "#62e6c4",
        "#f3f06d",
        "#f1a93d",
        "#f06a3c",
        "#c03990"
    ];

    div.innerHTML += "<h4>Depth (km)</h4>"

    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            "<i style='background:" + colors[i] + "'></i> " +
            depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }

    return div;
};

legend.addTo(myMap);
