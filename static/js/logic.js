// Part 1: Create the Earthquake Visualization
// Based on code from Activities:  1.10 GeoJASON & 1.07 Stu Country GDp 
// Get the dataset from USGS GeoJSON Feed page
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Create the base layers.
const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create a baseMaps object.
const baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};

// Create an overlay object to hold our overlay.
const overlayMaps = {};

// Create our map, giving it the streetmap layer to display on load.
const myMap = L.map("map", {
  center: [20, -50],
  zoom: 2.5,
  layers: [street]
});

// Create a layer control.
// Pass it our baseMaps and overlayMaps.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
  // Add legend to the map
  addLegend();
});

function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Loop through the array and create one marker for each earthquake.
  for (let i = 0; i < earthquakeData.length; i++) {
    // Conditionals for depth (third coordinate) -->https://www.w3schools.com/cssref/css_colors.php
    let color = "";
    if (earthquakeData[i].geometry.coordinates[2] > 90) {
      color = "red";
    } else if (earthquakeData[i].geometry.coordinates[2] > 70) {
      color = "darkorange";
    } else if (earthquakeData[i].geometry.coordinates[2] > 50) {
      color = "orange";
    } else if (earthquakeData[i].geometry.coordinates[2] > 30) {
      color = "yellow";
    } else if (earthquakeData[i].geometry.coordinates[2] > 10) {
      color = "greenyellow";
    } else {
      color = "palegreen";
    }
    // Add circles to the map.
    L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: "",
      fillColor: color,
      // Adjust the radius.
      radius: Math.sqrt(earthquakeData[i].properties.mag) * 100000
    }).bindPopup(`<h1>${earthquakeData[i].properties.place}</h1> <hr> <h3>Magnitude: ${earthquakeData[i].properties.mag}</h3>`).addTo(myMap);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  const earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Add the earthquakes layer to the overlay object.
  overlayMaps["Earthquakes"] = earthquakes;
}

// Function to add legend to the map Added with ChatGPT
function addLegend() {
    const legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function(map) {
      const div = L.DomUtil.create('div', 'info legend');
      const grades = [0, 10, 30, 50, 70, 90];
      const colors = ["palegreen", "greenyellow", "yellow", "orange", "darkorange", "red"];
  
      // Loop through the density intervals and create a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
    };
  
    legend.addTo(myMap);
}