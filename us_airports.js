document.addEventListener('DOMContentLoaded', () => {
  fetch('./us_airports.json')
    .then(response => response.json())
    .then(data => {
      const usAirports = filterUSAirports(data);
      displayAirports(usAirports);
    })
    .catch(error => console.error('Error fetching the JSON file:', error));
  
    
  function filterUSAirports(data) {
    const usAirports = {};
    for (const [key, airport] of Object.entries(data)) {
      if (airport.country === 'US' & airport.iata !== '') {
        usAirports[key] = airport;
      }
    }
    return usAirports;
  }

  function displayAirports(airports) {
    const tableContainer = document.getElementById('airports-table');
    if (!tableContainer) {
      console.error('Table container element not found');
      return;
    }
    const totalAirports = Object.keys(airports).length;

    console.log(`Total airports: ${totalAirports}`);
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // table headers
    const headers = ['ICAO', 'IATA', 'Name', 'City', 'State', 'Country', 'Latitude', 'Longitude'];
    headers.forEach(headerText => {
      const header = document.createElement('th');
      header.textContent = headerText;
      headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    // Create table rows
    for (const key in airports) {
      const airport = airports[key];
      const row = document.createElement('tr');

      const cells = [
        airport.icao, airport.iata, airport.name, airport.city, airport.state,
        airport.country, airport.lat, airport.lon, 
      ];

      cells.forEach(cellText => {
        const cell = document.createElement('td');
        cell.textContent = cellText;
        row.appendChild(cell);
      });

      table.appendChild(row);
    }

    tableContainer.appendChild(table);
  }

  // HAVERSINE FORMULA: calcculate distance between two airports given their latitude and longitude
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 3959; 
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
  }

  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  console.log('The distance between ORD - JFK is:', calculateDistance(41.9786, -87.9048, 40.6397, -73.7789));


});

