function createMap(earthquakeArr) {
  
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var overlayMaps = {
    "Earthquakes": earthquakeArr
  };
  var baseMaps = {
    "Light Map": lightmap
  };

  var myMap = L.map("map", {
    center: [40, -110],
    zoom: 5,
    layers: [lightmap, earthquakeArr]
  });

  var info = L.control({
    position: "topright"
  });

};

  // Function to determine marker size based on population
function markerSize(mag) {
    return mag * 10000;
  }

function getColor(mag) {
  if (mag <=1) {
    return "#edf8fb";
  } else if (mag <=2) {
      return "#ccece6";
  } else if (mag<=3) {
      return "#99d8c9";
  } else if (mag<=4) {
      return "#66c2a4";
  } else if (mag<=5) {
      return "#2ca25f";
  } else {
      return "#99d8c9";
  }
}


function createMarkers(response) {

    // Pull the "stations" property off of response.data
    var earthquakes = response.features;

    console.log(earthquakes[0].geometry.coordinates);
    console.log(earthquakes[0])
  
    // Initialize an array to hold bike markers
    var quakeMarkers = [];
  
    // Loop through the stations array
    for (var i = 0; i < earthquakes.length; i++) {
      var quake = earthquakes[i];
      var mag = quake.properties.mag;
  
      // For each station, create a marker and bind a popup with the station's name
      var quakeMarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.9,
        color: "white",
        fillColor: getColor(mag),
        radius: markerSize(mag)
      })
        .bindPopup("<h3>" + quake.properties.place + "<h3><hr><h4>Magnitude: " + mag + "<h4>");
      console.log(getColor(mag));
      // Add the marker to the bikeMarkers array
      quakeMarkers.push(quakeMarker);
    }
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
  }

  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);