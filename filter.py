import json

# Load the JSON data
with open('us_airports.json', 'r') as file:
    data = json.load(file)

# Filter the airports
filtered_airports = {
    code: details
    for code, details in data.items()
    if details.get("country") == "US" and details.get("iata")
}

# Save the filtered results
with open('filtered_airports.json', 'w') as file:
    json.dump(filtered_airports, file, indent=4)

print(f"Filtered {len(filtered_airports)} airports.")
