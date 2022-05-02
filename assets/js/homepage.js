/*
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
 */
var lat = "";
var lon = "";
//user inputs for location

/*Geocoding API */
/*http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
 */


var getWeatherData = function(user) {
    var apiUrl = "api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=552c28f9a84ca8a59f4fa26c415a4a21";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
            displayRepos(data, user);
            }); 
        } else {
            alert("Error: GitHub user not found");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to GitHub");
    });
};