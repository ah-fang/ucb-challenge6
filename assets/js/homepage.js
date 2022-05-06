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

var apiKey = "552c28f9a84ca8a59f4fa26c415a4a21";

//the form that holds the input
var cityFormEl = document.querySelector("#city-form");

//the place users enter the city name
var cityInputEl = document.querySelector("#city-name");

//where the daily data will be displayed
var todayBox = document.getElementById("daily-list");

var city;

// function saveCities() {
//     //generate the gray buttons of previous cities
//     var cityBtn = document.createElement("button");
//     cityBtn.class = "btn";
//     // cityBtn.id = the city name you input before, a name which was saved in a var;
//     //cityBtn.addEventListener("click", functionThatCallsApiByCityName);
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

var searchButton = document.querySelector("#search-btn");

searchButton.addEventListener("click", function(event) {
    // var cityInputEl = document.querySelector("#cityInput");
    var cityName = cityInputEl.value.trim();
   
    event.preventDefault();

    if (cityName) {
        var cards = document.getElementById("forecast-card");
        if (cards) {
            clearCards();
        }
        geoLocate(cityName);
        cityInputEl.value = "";
    } else {
        window.alert("Please enter a city name");
    }
})

//function to clear 5day forecast cards before each new city search
function clearCards() {
    for (var i = 0; i < 5 ; i++) {
        var cards = document.getElementById("forecast-card");
        cards.remove();
    }
}

function cityBtnList() {
    var cityList = JSON.parse(localStorage.getItem("cityList"));
    var cityBtnDiv = document.querySelector("#city-list");

    if (cityList) {
        //"let" is necessary over "var" here to escape closure issue
        for (let i = 0; i < cityList.length; i++) {
            let cityBtn = document.createElement("button");
            cityBtn.textContent = cityList[i];  
            cityBtn.className = "city-button";
            cityBtn.setAttribute("value", cityBtn.textContent);
            cityBtnDiv.appendChild(cityBtn);
            cityBtn.addEventListener("click", function () {
                console.log(cityBtn.textContent);
                
                //when these buttons are pushed, the city requested in URL should match what the button reads
                var cityName = cityBtn.textContent;

                var cards = document.getElementById("forecast-card");
                if (cards) {
                    clearCards();
                }
                geoLocate(cityName);

            })
        }
    }
}

    //     //Create an input type dynamically.
    //     function addOnClick(element, currentName) {
    //         element.onClick = function () {
    //            alert("button is " + names[currentName].msg);
    //       };
    //     };   
        
        
    //     //solution
    //     element.onclick = function () { // Note this is a function
    //         alert("button is "+ names[name].msg);
    //     };
    // // Should be wrapped by a function that passes in the name you're interested in:

    // addOnClickToElement(element,name);
    // // Then add this named function at the same scope as 'add' so that names is accessible:

    // function addOnClickToElement(element,name) { // Note this is a function
    //     element.onclick = function(){
    //         alert("button is "+ names[name].msg);
    //     };
    // }




//makes new city buttons on the page when a city is searched
function makeCityBtn(cityName) {
    var cityBtnDiv = document.querySelector("#city-list");

    var cityBtn = document.createElement("button");
    cityBtn.textContent = cityName;
    cityBtn.className = "city-button";
    cityBtnDiv.appendChild(cityBtn);
    
    cityBtn.addEventListener("click", function () {
        var cards = document.getElementById("forecast-card");
        if (cards) {
            clearCards();
        }
        geoLocate(cityName);
    })
}

//checks for new cities and saves to storage
function saveCity(cityName) {
    var cityList = JSON.parse(localStorage.getItem("cityList"));
    //saves only new cities to local storage
    if (cityList !== null) {
        var dejaVu = false;
        for (var i = 0; i < cityList.length; i++) {
            if (cityList[i] === cityName) {
                dejaVu = true;
            }
        }
        if (!dejaVu) {
            cityList.push(cityName);
            // todo add button logic
            // add single button to existing buttons
            makeCityBtn(cityName);

        }
    } else {
        cityList = [];
        cityList.push(cityName);
    }
    localStorage.setItem("cityList", JSON.stringify(cityList));
}

// GeoLocation API
function geoLocate(cityName) {
    var requestUrl =
        "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + apiKey;
    fetch(requestUrl)
        .then(function (response) { 
            if (response.ok) { 
                // convert response into JSON
                return response.json();
            } else {
                //error message
                alert('Request could not be completed');
            }
        })
        .then(function (data) {
            // pass data into function parsing the data
            var cityNameEl = document.querySelector("#today-name");
            cityNameEl.textContent = data[0].name;

            saveCity(data[0].name);

            fetchCityWeather(data);

        })
        .catch(function (error) {
        console.log(error);
    });
}

function fetchCityWeather(data) {
    var requestUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" + data[0].lat + "&lon="+ data[0].lon + "&units=imperial&appid=" + apiKey;
    fetch(requestUrl)
        .then(function(response) { 
            if (response.ok) { 
                // convert response into JSON
                return response.json();
            } else {
                //error message
                alert('Request could not be completed');
                console.log("error 2:");
                console.log(error);
            }})
        .then(function(data) {
            console.log(data);
            //fill in that location's daily and five-day forecast
            currentForecast(data);
            fiveDayForecast(data);
        })
        .catch(function (error) {
        console.log(error);
    });

}

function currentForecast(data) {
    // date element
    var date = new Date(data.current.dt * 1000);
    var formattedDate = date.toLocaleDateString();
    var currentConditionsDateEl = document.querySelector("#today-date");
    currentConditionsDateEl.textContent = formattedDate;

    // icon element
    // var currentConditionsIconEl = document.querySelector("#currentIcon");
    // var iconId = data.current.weather[0].icon;
    // currentConditionsIconEl.src = "https://openweathermap.org/img/wn/" +iconId+"@2x.png"
    // currentConditionsIconEl.className = "currentIcon";

    // temperature element in Farenheit
    var currentTempEl = document.querySelector("#temp-now");
    var tempF = data.current.temp;
    currentTempEl.textContent = "Temp: " + tempF + "°F";

    // wind speed in mph
    var currentWindSpeed = document.querySelector("#wind-now")
    var windSpeed = data.current.wind_speed;
    currentWindSpeed.textContent = "Wind: " + windSpeed + " mph";

    // humidity in %
    var currentHumidityEl = document.querySelector("#humidity-now");
    currentHumidityEl.textContent = "Humidity: " + data.current.humidity + "%";

    // uv index
    var currentUVI = document.querySelector("#uv-index-now");
    currentUVI.textContent = data.current.uvi;
    
    //stoplight-code UV index by range
    if (data.current.uvi <= 2) {
        currentUVI.className = "bg-success text-light";
    } else if (data.current.uvi > 2 && data.current.uvi < 8) {
        currentUVI.className ="bg-warning";
    } else {
        currentUVI.className = "bg-danger text-light";
    }

}


//function that dynamically generates the 5 cards
function fiveDayForecast(data) {
//note: i begins at 1 instead of 0 to ensure no overlap between daily and 5-day
    for (var i = 1; i < 6; i++) {
        var dayCard = document.createElement("div");
        dayCard.className = "col-12 col-sm-4 col-lg-2 m-2 bg-dark text-light"
        dayCard.id = "forecast-card";

        // date on card
        var date = new Date(data.daily[i].dt * 1000);
        var formatDate = date.toLocaleDateString();
        var dateEl = document.createElement("h5");
        dateEl.className = "p-2";
        dateEl.textContent = formatDate;
        dayCard.appendChild(dateEl);

        // icon element
        var icon = document.createElement("img");
        var iconId = data.daily[i].weather[0].icon;
        icon.src = "https://openweathermap.org/img/wn/" + iconId + "@2x.png"
        icon.className = "currentIcon";

        dayCard.appendChild(icon);

        var cardTemp = document.createElement("p");
        var tempF = data.daily[i].temp.day;
        cardTemp.textContent = "Temp: " + tempF + "°F";
        dayCard.appendChild(cardTemp);

        var cardWindSpeed = document.createElement("p");
        var windSpeed = data.daily[i].wind_speed;
        cardWindSpeed.textContent = "Wind Speed: " + windSpeed + " mph";
        dayCard.appendChild(cardWindSpeed);


        var cardHumidity = document.createElement("p");
        cardHumidity.textContent = "Humidity: " + data.daily[i].humidity + "%";
        dayCard.appendChild(cardHumidity);


        var fiveDayBox = document.querySelector("#five-day-forecast");
        fiveDayBox.className = "d-flex justify-content-between row";
        fiveDayBox.appendChild(dayCard);
    }

}

//fetch previous searches from localStorage
cityBtnList();