// Names: Alhagie Boye, Sukhbir Singh, Vamsi Sudersanam
// Class: CSC 3310 - Algorithms

// Setting up the Google Charts library and creating a callback function
google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(() => {
    window.chartsLoaded = true; 
});

// Our 10 airport coordinates
const airportCoordinates = {
    'ATL': [33.6407, -84.4277],
    'DFW': [32.8998, -97.0403],
    'LAX': [33.9416, -118.4085],
    'ORD': [41.9742, -87.9073],
    'DEN': [39.8561, -104.6737],
    'JFK': [40.6413, -73.7781],
    'SFO': [37.7749, -122.4194],
    'SEA': [47.4502, -122.3088],
    'MIA': [25.7959, -80.2870],
    'CLT': [35.2144, -80.9473]
};

// Graph with distances between airports
const graph = {
  'ATL': {
      'DFW': 731, 'LAX': 1946, 'ORD': 606, 'DEN': 1199, 'JFK': 760,
      'SFO': 2139, 'SEA': 2182, 'MIA': 595, 'CLT': 226
  },
  'DFW': {
      'ATL': 731, 'LAX': 1235, 'ORD': 802, 'DEN': 641, 'JFK': 1391,
      'SFO': 1464, 'SEA': 1670, 'MIA': 1121, 'CLT': 936
  },
  'LAX': {
      'ATL': 1946, 'DFW': 1235, 'ORD': 1744, 'DEN': 862, 'JFK': 2475,
      'SFO': 337, 'SEA': 954, 'MIA': 2342, 'CLT': 2113
  },
  'ORD': {
      'ATL': 606, 'DFW': 802, 'LAX': 1744, 'DEN': 888, 'JFK': 740,
      'SFO': 1846, 'SEA': 1720, 'MIA': 1197, 'CLT': 599
  },
  'DEN': {
      'ATL': 1199, 'DFW': 641, 'LAX': 862, 'ORD': 888, 'JFK': 1620,
      'SFO': 967, 'SEA': 1024, 'MIA': 1729, 'CLT': 1402
  },
  'JFK': {
      'ATL': 760, 'DFW': 1391, 'LAX': 2475, 'ORD': 740, 'DEN': 1620,
      'SFO': 2586, 'SEA': 2422, 'MIA': 1090, 'CLT': 541
  },
  'SFO': {
      'ATL': 2139, 'DFW': 1464, 'LAX': 337, 'ORD': 1846, 'DEN': 967,
      'JFK': 2586, 'SEA': 679, 'MIA': 2584, 'CLT': 2295
  },
  'SEA': {
      'ATL': 2182, 'DFW': 1670, 'LAX': 954, 'ORD': 1720, 'DEN': 1024,
      'JFK': 2422, 'SFO': 679, 'MIA': 2724, 'CLT': 2280
  },
  'MIA': {
      'ATL': 595, 'DFW': 1121, 'LAX': 2342, 'ORD': 1197, 'DEN': 1729,
      'JFK': 1090, 'SFO': 2584, 'SEA': 2724, 'CLT': 650
  },
  'CLT': {
      'ATL': 226, 'DFW': 936, 'LAX': 2113, 'ORD': 599, 'DEN': 1402,
      'JFK': 541, 'SFO': 2295, 'SEA': 2280, 'MIA': 650
  }
};

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
  otherRoutes.forEach(route => {
      row = document.createElement('tr');
      cell = document.createElement('td');
      cell.textContent = route.description;
      row.appendChild(cell);
      cell = document.createElement('td');
      cell.textContent = route.distance;
      row.appendChild(cell);
      tbody.appendChild(row);
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




