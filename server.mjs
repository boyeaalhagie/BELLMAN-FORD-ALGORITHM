import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import airports from './60_airports.json' assert { type: 'json' };

const app = express();
const port = 3000;

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public'))); // Ensure your HTML and static files are in a 'public' folder

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint: Get Airport Details
app.get('/airports', (req, res) => {
    res.json(airports);
});

// Endpoint: Compute Shortest Path
app.post('/shortest-path', (req, res) => {
    const { start, end } = req.body;

    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end airports are required' });
    }

    const graph = buildGraph(airports);

    const result = bellmanFord(graph, start, end);
    res.json(result);
});

// Build graph from airports
function buildGraph(airports) {
    const graph = {};
    for (const airport of airports) {
        graph[airport.IATA] = {};
        for (const destination of airports) {
            if (airport.IATA !== destination.IATA) {
                const distance = calculateDistance(
                    airport.LAT,
                    airport.LONG,
                    destination.LAT,
                    destination.LONG
                );
                if (distance <= 1000) { // Filter for nearby airports
                    graph[airport.IATA][destination.IATA] = distance;
                }
            }
        }
    }
    return graph;
}

// Bellman-Ford algorithm
function bellmanFord(graph, start, end) {
    const distances = {};
    const predecessors = {};

    for (const node in graph) {
        distances[node] = Infinity;
        predecessors[node] = null;
    }
    distances[start] = 0;

    for (let i = 0; i < Object.keys(graph).length - 1; i++) {
        for (const u in graph) {
            for (const v in graph[u]) {
                if (distances[u] + graph[u][v] < distances[v]) {
                    distances[v] = distances[u] + graph[u][v];
                    predecessors[v] = u;
                }
            }
        }
    }

    const path = [];
    let current = end;
    while (current) {
        path.unshift(current);
        current = predecessors[current];
    }

    return {
        distance: distances[end] !== Infinity ? distances[end] : null,
        path: path.length > 1 ? path : null,
    };
}

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 3959; // miles
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(earthRadius * c);
}

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
