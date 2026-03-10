# Smart Travel Itinerary Planner

A web-based application that helps users generate a simple travel itinerary for a city based on their interests and number of travel days. The application displays nearby places on an interactive map and organizes them into a day-wise travel plan.

## Features

- Search for any city
- Select number of travel days
- Choose travel interest (Food, Nature, Culture, General)
- View places on an interactive map
- Automatically generate a day-wise itinerary
- Distance-based grouping of nearby places
- Famous places prioritized using a scoring system


## Technologies Used

- HTML – Structure of the webpage  
- CSS – Styling and layout  
- JavaScript – Application logic and itinerary generation  
- Leaflet – Interactive map display  
- OpenStreetMap – Map data  
- Overpass API – Fetch nearby places based on categories  
- Nominatim API – Convert city names into coordinates  


## How It Works

1. The user enters a city name and number of travel days.
2. The system retrieves the city’s latitude and longitude using the Nominatim API.
3. Nearby places are fetched using the Overpass API based on the selected interest category.
4. Places are ranked using a scoring system to prioritize well-known locations.
5. A distance-based clustering algorithm groups nearby places together.
6. A day-wise itinerary is generated and displayed on the page.
7. All locations are also shown on the interactive map.


