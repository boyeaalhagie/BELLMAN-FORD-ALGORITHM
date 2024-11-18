// Load the Google Charts library and set up callback
google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(() => {
    window.chartsLoaded = true; 
});

// Define the graph with distances between airports
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


// Modified Bellman-Ford Algorithm to track paths
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

// Validate and display results
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
        drawTable(userRoute, userDistance, shortestPath, shortestDistance, startAirport, endAirport);
    }
}

function drawTable(userRoute, userDistance, shortestPath, shortestDistance, start, end) {
  const tableContainer = document.getElementById('chart_div');
  tableContainer.innerHTML = ''; // Clear any previous table

  const table = document.createElement('table');
  table.classList.add('table', 'table-striped', 'table-bordered', 'mt-4');

  // Create table headers
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

  // Create table body
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

// GOOGLE MAP
// Airport coordinates
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

// Initialize map
let map = L.map('map').setView([39.8283, -98.5795], 4); // Center of US

// Add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let routeLayer = L.layerGroup().addTo(map);
let markersLayer = L.layerGroup().addTo(map);

function drawRoute(route, color) {
    // Clear previous routes of this color
    routeLayer.eachLayer((layer) => {
        if (layer.options.color === color) {
            routeLayer.removeLayer(layer);
        }
    });

    // Create array of coordinates for the route
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
        // Clear previous markers and routes
        markersLayer.clearLayers();
        routeLayer.clearLayers();

        // Draw table
        drawTable(userRoute, userDistance, shortestPath, shortestDistance, startAirport, endAirport);
        
        // Draw user's route in blue
        drawRoute(userRoute, 'red');
        
        // Draw shortest path in red after a delay
        setTimeout(() => {
            drawRoute(shortestPath, 'green');
        }, 1000);

        // Fit the map to show all markers
        const allCoords = [...userRoute, ...shortestPath].map(airport => airportCoordinates[airport]);
        map.fitBounds(allCoords);
    }
}

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([39.8283, -98.5795], 4); // Centered on the US

    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Force the map to resize in case of rendering issues
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
});
