// Global variable declarations
var destLoc = [];
var destination;

// local storage functions
initdestLoc();
initForecast();


// This function displays the city entered by the user into the DOM
function  callCity(){
    $("#destLoc").empty();
    $("#locInput").val("");
    
    for (i=0; i<destLoc.length; i++){
        let a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        a.attr("data-name", destLoc[i]);
        a.text(destLoc[i]);
        $("#destLoc").prepend(a);
    } 
}

// This function pulls the city list array from local storage
function initdestLoc() {
    let searchedCities = JSON.parse(localStorage.getItem("cities"));
    
    if (searchedCities !== null) {
        destLoc = searchedCities;
    }
    
     callCity();
    }

// This function pull the current city into local storage to display the current weather forecast on reload
function initForecast() {
    let storedWeather = JSON.parse(localStorage.getItem("currentCity"));

    if (storedWeather !== null) {
        destination = storedWeather;

        displayWeather();
        displayFiveDayForecast();
    }
}

// This function saves the city array to local storage
function storeCityArray() {
    localStorage.setItem("cities", JSON.stringify(destLoc));
    }

// This function saves the currently display city to local storage
function storeCurrentCity() {

    localStorage.setItem("currentCity", JSON.stringify(destination));
}
      

// Click event handler for city search button
$("#citySearchBtn").on("click", function(event){
    event.preventDefault();

    destination = $("#locInput").val().trim();
    if(destination === ""){
        alert("Please enter a city to look up")

    }else if (destLoc.length >= 8){  
        destLoc.shift();
        destLoc.push(destination);

    }else{
    destLoc.push(destination);
    }
    storeCurrentCity();
    storeCityArray();
    callCity();
    displayWeather();
    displayFiveDayForecast();
});

// Event handler for if the user hits search after entering the city search term
$("#locInput").keypress(function(e){
    if(e.which == 13){
        $("#citySearchBtn").click();
    }
})

// This function runs the Open Weather API AJAX call and displays the current city, weather, and 5 day forecast to the DOM
async function displayWeather() {

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + destination + "&units=imperial&appid=45cf02c8c0c3b1ea03a6ce484a30811d";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      })
        console.log(response);

        let currentWeatherDiv = $("<div class='card-body' id='currentWeather'>");
        let getCurrentCity = response.name;
        let date = new Date();
        let val=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
        let getCurrentWeatherIcon = response.weather[0].icon;
        let displayCurrentWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + "@2x.png />");
        let currentCityEl = $("<h3 class = 'card-body'>").text(getCurrentCity+" ("+val+")");
        currentCityEl.append(displayCurrentWeatherIcon);
        currentWeatherDiv.append(currentCityEl);
        let getTemp = response.main.temp.toFixed(1);
        let tempEl = $("<p class='card-text'>").text("Temperature: "+getTemp+"° F");
        currentWeatherDiv.append(tempEl);
        let getHumidity = response.main.humidity;
        let humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        currentWeatherDiv.append(humidityEl);
        let getWindSpeed = response.wind.speed.toFixed(1);
        let windSpeedEl = $("<p class='card-text'>").text("Wind Speed: "+getWindSpeed+" mph");
        currentWeatherDiv.append(windSpeedEl);
        let getLong = response.coord.lon;
        let getLat = response.coord.lat;
        
        let uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=45cf02c8c0c3b1ea03a6ce484a30811d&lat="+getLat+"&lon="+getLong;
        var uvResponse = await $.ajax({
            url: uvURL,
            method: "GET"
        })

        // getting UV Index info and setting color class according to value
        let getUVIndex = uvResponse.value;
        var uvNumber = $("<span>");
        if (getUVIndex > 0 && getUVIndex <= 2.99){
            uvNumber.addClass("low");
        }else if(getUVIndex >= 3 && getUVIndex <= 5.99){
            uvNumber.addClass("moderate");
        }else if(getUVIndex >= 6 && getUVIndex <= 7.99){
            uvNumber.addClass("high");
        }else if(getUVIndex >= 8 && getUVIndex <= 10.99){
            uvNumber.addClass("vhigh");
        }else{
            uvNumber.addClass("extreme");
        } 
        uvNumber.text(getUVIndex);
        let uvIndexEl = $("<p class='card-text'>").text("UV Index: ");
        uvNumber.appendTo(uvIndexEl);
        currentWeatherDiv.append(uvIndexEl);
        $("#weatherContainer").html(currentWeatherDiv);
}

// This function runs the AJAX call for the 5 day forecast and displays them to the DOM
async function displayFiveDayForecast() {

    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+destination+"&units=imperial&appid=d3b85d453bf90d469c82e650a0a3da26";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      })
      let forecastDiv = $("<div  id='fiveDayForecast'>");
      let forecastHeader = $("<h5 class='card-header border-secondary'>").text("5 Day Forecast");
      forecastDiv.append(forecastHeader);
      let cardDeck = $("<div  class='card-deck'>");
      forecastDiv.append(cardDeck);
      
      console.log(response);
      for (i=0; i<5;i++){
          let forecastCard = $("<div class='card mb-3 mt-3'>");
          let cardBody = $("<div class='card-body'>");
          let date = new Date();
          let val=(date.getMonth()+1)+"/"+(date.getDate()+i+1)+"/"+date.getFullYear();
          let forecastDate = $("<h5 class='card-title'>").text(val);
          
        cardBody.append(forecastDate);
        let getCurrentWeatherIcon = response.list[i].weather[0].icon;
        console.log(getCurrentWeatherIcon);
        let displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + ".png />");
        cardBody.append(displayWeatherIcon);
        let getTemp = response.list[i].main.temp;
        let tempEl = $("<p class='card-text'>").text("Temp: "+getTemp+"° F");
        cardBody.append(tempEl);
        let getHumidity = response.list[i].main.humidity;
        let humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        cardBody.append(humidityEl);
        forecastCard.append(cardBody);
        cardDeck.append(forecastCard);
      }
      $("#forecastContainer").html(forecastDiv);
    }

// This function is used to pass the city in the history list to the displayWeather function
function historyDisplayWeather(){
    destination = $(this).attr("data-name");
    displayWeather();
    displayFiveDayForecast();
    console.log(destination);
    
}

$(document).on("click", ".city", historyDisplayWeather);