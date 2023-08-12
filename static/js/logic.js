//Part 1: Create the Earthquake Visualization

//Get the dataset from USGS GeoJSON Feed page 
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    //Loop through the array and create one marker for each place object.
    for (let i = 0; i < earthquakeData.length; i++) {
      // Conditionals for magnitude
      let color = "";
      if (earthquakeData[i].properties.mag > 5) {
        color = "red";
      }
      else if (earthquakeData[i].properties.mag > 4) {
        color = "orange";
      }
      else if (earthquakeData[i].properties.mag > 3) {
        color = "yellow";
      }
      else if (earthquakeData[i].properties.mag > 2) {
        color = "green";
      }
      else if (earthquakeData[i].properties.mag > 1) {
        color = "blue";
      }
      else {
        color = "violet";
      }
      // Add circles to the map.
      L.circle(earthquakeData[i].geometry.coordinates, {
        fillOpacity: 0.75,
        color: "white",
        fillColor: color,
        // Adjust the radius.
        radius: Math.sqrt(earthquakeData[i].properties.mag) * 50000
      }).bindPopup(`<h1>${earthquakeData[i].properties.place}</h1> <hr> <h3>Magnitude: ${earthquakeData[i].properties.mag}</h3>`).addTo(myMap);
    }




    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });


  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
     // Create our map, giving it the streetmap and earthquakes layers to display on load.
     let myMap = L.map("map", {
        center: [
          20, -50
        ],
        zoom: 2.5,
        layers: [street, earthquakes]
      });
  
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  }
  