// Names: Alhagie Boye, Sukhbir Singh, Vamsi Sudersanam
// Class: CSC 3310 - Algorithms

// Setting up the Google Charts library and creating a callback function
google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(() => {
    window.chartsLoaded = true; 
});

// Fetch the data and populate the dropdowns
fetch('./airports_data.json')
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => a.NAME.localeCompare(b.NAME));
        // Populate the dropdowns with airport data
        populateDropdown('startAirport', data);
        populateDropdown('endAirport', data);

        // Populate graph and coordinates after loading data
        data.forEach(airport => {
            airportCoordinates[airport.IATA] = [airport.LAT, airport.LONG];
        });

        graph = buildGraph(data);
        
    })
    .catch(error => {
        console.error('Error loading airport data:', error);
    });
    
let airportCoordinates = {};
let graph = {};

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 3959; // Earth's radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance = earthRadius * c;
    return Math.round(distance);
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Dynamically build graph from airport data
function buildGraph(airports) {
    const graph = {};
    airports.forEach((source) => {
        graph[source.IATA] = {};
        airports.forEach((destination) => {
            if (source.IATA !== destination.IATA) {
                const distance = calculateDistance(
                    source.LAT, source.LONG,
                    destination.LAT, destination.LONG
                );
                graph[source.IATA][destination.IATA] = distance;
            }
        });
    });
    return graph;
}

// Function to populate a dropdown with airport options
function populateDropdown(selectorId, airports) {
    const dropdown = document.getElementById(selectorId);

    airports.forEach(airport => {
        const option = document.createElement('option');
        option.value = airport.IATA;
        option.textContent = `${airport.IATA} - ${airport.NAME}`;
        dropdown.appendChild(option);
    });
}


    
// Our modified bellman-ford algorithm function
// NOTE: WE WILL NEED TO OPTIMISE THE ALGORITHM TO HANDLE MULTIPLE ROUTES AND AIRPORTS
function bellmanFord(graph, start, end) {
    const distances = {};
    const predecessors = {}; 

    for (let node in graph) {
        distances[node] = Infinity;
        predecessors[node] = null;
    }
    distances[start] = 0;

    for (let i = 0; i < Object.keys(graph).length - 1; i++) {
        for (let u in graph) {
            for (let v in graph[u]) {
                if (distances[u] + graph[u][v] < distances[v]) {
                    distances[v] = distances[u] + graph[u][v];
                    predecessors[v] = u;
                }
            }
        }
    }

    let path = [];
    let current = end;
    while (current) {
        path.unshift(current);
        current = predecessors[current];
    }

    return {
        distance: distances[end] !== Infinity ? distances[end] : null,
        path: path.length > 1 ? path : null
    };
}


// Function to calculate the distance of a route
function calculateRouteDistance(graph, route) {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        const start = route[i];
        const end = route[i + 1];
        if (graph[start] && graph[start][end] !== undefined) {
            totalDistance += graph[start][end];
        } else {
            return null;
        }
    }
    return totalDistance;
}



// Function to draw the table. The table will display the user's route and the algorithm's routes.
function drawTable(userRoute, userDistance, shortestPath, shortestDistance, start, end) {
  const tableContainer = document.getElementById('chart_div');
  tableContainer.innerHTML = ''; 

  const table = document.createElement('table');
  table.classList.add('table', 'table-striped', 'table-bordered', 'mt-4');

  // table headers
  const headers = ['Route Description', 'Distance (miles)'];
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // table body
  const tbody = document.createElement('tbody');

  // User's Proposed Route
  let row = document.createElement('tr');
  let cell = document.createElement('td');
  cell.textContent = `User's Route: ${userRoute.join(' -> ')}`;
  row.appendChild(cell);
  cell = document.createElement('td');
  cell.textContent = userDistance;
  row.appendChild(cell);
  tbody.appendChild(row);

  // Shortest Route
  row = document.createElement('tr');
  cell = document.createElement('td');
  cell.textContent = `Direct Route: ${shortestPath.join(' -> ')}`;
  row.appendChild(cell);
  cell = document.createElement('td');
  cell.textContent = shortestDistance;
  row.appendChild(cell);
  tbody.appendChild(row);

  // Collect all other possible routes with one connecting flight (excluding user’s route)
  const otherRoutes = [];
  for (let connecting in graph[start]) {
      if (connecting !== end && graph[connecting] && graph[connecting][end] !== undefined) {
          const connectingRoute = [start, connecting, end];
          const connectingDistance = graph[start][connecting] + graph[connecting][end];

          // Check if this route matches the user's route
          if (connectingRoute.join(' -> ') !== userRoute.join(' -> ')) {
              otherRoutes.push({
                  description: `Connecting Route: ${connectingRoute.join(' -> ')}`,
                  distance: connectingDistance
              });
          }
      }
  }

  // Sort the other routes by distance in ascending order
  otherRoutes.sort((a, b) => a.distance - b.distance);

  // Append sorted other routes to the table
  // Limit the table height and make it scrollable
    tableContainer.style.maxHeight = '300px'; // Adjust height as needed
    tableContainer.style.overflowY = 'auto';// Enables scrolling
    tableContainer.style.overflowX = 'hidden';

    // Append all sorted other routes to the table, but only show the first four initially
    otherRoutes.forEach((route, index) => {
        const row = document.createElement('tr');
        let cell = document.createElement('td');
        cell.textContent = route.description;
        row.appendChild(cell);
        cell = document.createElement('td');
        cell.textContent = route.distance;
        row.appendChild(cell);
        tbody.appendChild(row);

        // Highlight the first four rows
        if (index < 6) {
            row.style.backgroundColor = '#f9f9f9'; // Optional: Add styling for the first four rows
        }
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);

}

// LEEFLET MAP: Credit to OpenStreetMap, from DR Lembke
// Initialize map to the center of the US
let map = L.map('map').setView([39.8283, -98.5795], 4); 

// Add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let routeLayer = L.layerGroup().addTo(map);
let markersLayer = L.layerGroup().addTo(map);




// Helps draw the route on the map
function drawRoute(route, color) {
    // Clear previous routes of this color
    routeLayer.eachLayer((layer) => {
        if (layer.options.color === color) {
            routeLayer.removeLayer(layer);
        }
    });

    // Coordinates for the route
    const coordinates = route.map(airport => airportCoordinates[airport]);
    
    // Draw the route line
    L.polyline(coordinates, {
        color: color,
        weight: 3,
        opacity: 0.7
    }).addTo(routeLayer);

    // Add markers for each airport in the route
    coordinates.forEach((coord, index) => {
        const airport = route[index];
        L.marker(coord)
            .bindPopup(airport)
            .addTo(markersLayer);
    });
}

// Validate the route and display the results
function validateRoute() {
    const startAirport = document.getElementById("startAirport").value;
    const endAirport = document.getElementById("endAirport").value;
    const userRoute = document.getElementById("userRoute").value.split(',').map(a => a.trim());

    if (userRoute[0] !== startAirport || userRoute[userRoute.length - 1] !== endAirport) {
        alert("Error: Your route must start at " + startAirport + " and end at " + endAirport + ".");
        return;
    }

    const { distance: shortestDistance, path: shortestPath } = bellmanFord(graph, startAirport, endAirport);
    const userDistance = calculateRouteDistance(graph, userRoute);

    if (shortestDistance === null || shortestPath === null) {
        alert("Error: No path exists between the selected airports.");
    } else if (userDistance === null) {
        alert("Error: No direct connection between some airports in your route.");
    } else {
        markersLayer.clearLayers();
        routeLayer.clearLayers();

        // All other possible routes with one connecting flight
        const otherRoutes = [];
        for (let connecting in graph[startAirport]) {
            if (connecting !== endAirport && graph[connecting] && graph[connecting][endAirport] !== undefined) {
                const connectingRoute = [startAirport, connecting, endAirport];
                const connectingDistance = graph[startAirport][connecting] + graph[connecting][endAirport];

                // Exclude user's route
                if (connectingRoute.join(' -> ') !== userRoute.join(' -> ')) {
                    otherRoutes.push({
                        route: connectingRoute,
                        distance: connectingDistance
                    });
                }
            }
        }

        
        otherRoutes.sort((a, b) => a.distance - b.distance);

        const thirdRoute = otherRoutes.length > 0 ? otherRoutes[0].route : null;

        drawTable(userRoute, userDistance, shortestPath, shortestDistance, startAirport, endAirport);
        drawRoute(userRoute, 'red');

        // hello

        // The route from the 3rd column in green after a delay: I am manually using this because the shortest path is always the direct slight and I want to show the user the shortest connecting route
        if (thirdRoute) {
            setTimeout(() => {
                drawRoute(thirdRoute, 'green');
                map.fitBounds(thirdRoute.map(airport => airportCoordinates[airport]));
            }, 1000);
        } else {
            alert("No connecting routes found.");
        }
    }
}




