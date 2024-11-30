🛫 **Shortest Flight Path: Bellman-Ford Algorithm**

**Team Members**

Alhagie Boye [boyea@msoe.edu]

Sukhbir Singh [singhsu@msoe.edu]

Vamsi Sudersanam [sudersanamv@msoe.edu]

Class: CSC 3310 - Algorithms

📌 **Project Overview**

The Shortest Flight Path Algorithm is a web-based application designed to compute the optimal flight route between two airports based on multiple factors like distance, layovers, and potential extensions for time and cost considerations. The algorithm leverages the Bellman-Ford algorithm to calculate the shortest path and integrates an interactive user interface for validation and visualization of flight paths.

🎯 **Features**

***Shortest Path Calculation***: Uses the Bellman-Ford algorithm to compute the shortest path based on distance.

***Dynamic User Input***: Users can select their starting and destination airports from a dropdown menu and validate their custom routes.

***Interactive Visualization***: Displays routes on an interactive map using Leaflet.js, with markers for airports.



**🚀 How It Works: Frontend**

- Built using HTML, CSS, Bootstrap, and JavaScript.
- Dropdowns populated with airport data fetched dynamically from the backend.
- Interactive map implemented using Leaflet.js.
- Users can input custom routes, validate them, and compare them to the computed shortest route.

📊 **Algorithm**

The project uses the Bellman-Ford Algorithm to compute the shortest path between airports.

***Steps***:

- Parse the airport dataset into a sparse graph.
- Initialize distances to infinity for all nodes except the start node (distance = 0).
- Relax all edges repeatedly for (n-1) iterations to calculate the shortest path.
- Generate the path and its total distance as output.

🔧 **Setup**

***Prerequisites***

- A browser.

***Installation***

Clone the repository: 

git clone https://github.com/boyeaalhagie/BELLMAN-FORD-ALGORITHM.git

***Run the Frontend***

- Open frontend/index.html in your browser.
- You will need a live server in you are using vscode.

**📈 Future Extensions**

***Multi-Factor Weighting***:
- Include cost, layovers, weather, and flight duration.

***Dynamic Data Integration***:
- APIs for real-world weather (OpenWeatherMap) and traffic data (FAA).

***User-Centric Features***:
- Allow users to customize weight priorities (e.g., prioritize cost over distance).

***Flight Schedules***:
- Add real-time scheduling for flights using airline APIs.

🙌 Acknowledgments

- Leaflet.js for map visualizations.
  
- Bootstrap for UI design.
