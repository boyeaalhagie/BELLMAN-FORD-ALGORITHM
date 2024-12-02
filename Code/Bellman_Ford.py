import csv

class Graph:
    def __init__(self, vertices):
        """
        Initialize the graph.
        :param vertices: Number of vertices (airports)
        """
        self.vertices = vertices  # Number of airports
        self.edges = []           # List of edges (connections between airports)

    def add_edge(self, source, destination, weight):
        """
        Add an edge to the graph.
        :param source: Source airport
        :param destination: Destination airport
        :param weight: Distance (cost) between source and destination
        """
        self.edges.append((source, destination, weight))

    def bellman_ford(self, source):
        """
        Perform the Bellman-Ford algorithm to find the shortest path.
        :param source: Starting airport
        :return: Distances from source to all other airports
        """
        # Step 1: Initialize distances
        distances = [float('inf')] * self.vertices
        distances[source] = 0  # Distance to the source is 0

        # Step 2: Relax edges repeatedly
        for _ in range(self.vertices - 1):
            for source, destination, weight in self.edges:
                if distances[source] != float('inf') and distances[source] + weight < distances[destination]:
                    distances[destination] = distances[source] + weight

        # Step 3: Check for negative weight cycles
        for source, destination, weight in self.edges:
            if distances[source] != float('inf') and distances[source] + weight < distances[destination]:
                raise ValueError("Graph contains a negative weight cycle")

        return distances


def load_data(file_path):
    """
    Load graph data from a CSV file.
    :param file_path: Path to the CSV file
    :return: Number of airports and a list of edges
    """
    edges = []
    airport_set = set()

    with open(file_path, 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # Skip the header
        for row in reader:
            source = int(row[0])
            destination = int(row[1])
            weight = float(row[2])
            edges.append((source, destination, weight))
            airport_set.add(source)
            airport_set.add(destination)

    return len(airport_set), edges
