// day, date
var date;
var day;
var cardDate;
var cardTime;
// update time, day, date
update();

function update() {
    var dt = new Date();
    var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    date = months[dt.getMonth()] + ', ' + dt.getDate() + ', ' + dt.getFullYear();
    day = day[dt.getDay()];

    document.getElementById("dateDiv").innerHTML = date;
    document.getElementById("dayDiv").innerHTML = day;
    setTimeout(update, 3.6e+6);
};

$(document).ready(function () {
    $("#error").hide();
    displayBttn();

    var APIKey = "e8c4953eaa486f7433658a72934020a9";
    var cityList = [];

    $("#search").click(getWeather);
    // $("#search").click(fiveDayForecast);
    $(document).on("click", ".city", displayInfo);
    $("#error").on("click", function () {
        $(this).hide();
    });

    // get current weather
    function getWeather() {
        event.preventDefault();
        // get input value
        var cityName = $("#input").val();
        // URL 
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=" + cityName + "&appid=" + APIKey;
        //AJAX
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // generate the buttons
            addBttn(cityName);
            // show information
            $(".weather").css("display", "block");
            $("#cityTitle").text(cityName);
            $(".wind").text(response.wind.speed + " m/s");
            $(".humidity").text(response.main.humidity + "%");
            $(".temp").text(response.main.temp + " °C");
            // show icons
            var weather = response.weather[0].main;
            changeIcon(weather);
            $("#description").text(response.weather[0].description);
            // get coordinates
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            // call function to get uv index
            getUVIndex(lat, lon);

            // local storage
            localStorage.setItem("cityList", JSON.stringify(cityList))
            $("#input").val("");
        });
        // when the input is not a vaild city an alert appear
        $(document).ajaxError(function () {
            $("#error").show();
        });

    };

    // get uv index
    function getUVIndex(lat, lon) {
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (response) {
            $(".uv").text(response.value);
            // change color according to the value
            if (response.value < 3) {
                $("#uvIndex").css("color", "green");
                $(".uv").css("color", "green");
                $(".warning").text("Low");
                $(".warning").css("backgroundColor", "green");
            } else if (response.value < 6) {
                $("#uvIndex").css("color", "yellow");
                $(".uv").css("color", "yellow");
                $(".warning").text("Moderate");
                $(".warning").css("backgroundColor", "rgb(255, 217, 4)");
            } else if (response.value < 8) {
                $("#uvIndex").css("color", "orange");
                $(".uv").css("color", "orange");
                $(".warning").text("High");
                $(".warning").css("backgroundColor", "orange");
            } else if (response.value < 11) {
                $("#uvIndex").css("color", "red");
                $(".uv").css("color", "red");
                $(".warning").text("Very high");
                $(".warning").css("backgroundColor", "red");
            } else if (response.value >= 11) {
                $("#uvIndex").css("color", "violet");
                $(".uv").css("color", "violet");
                $(".warning").text("Extreme");
                $(".warning").css("backgroundColor", "violet");
            }
        });
    };

    function addBttn(cityName) {
        var upper = cityName.toUpperCase();
        // if the input is already in the list
        if (cityList.indexOf(upper) !== -1) {
            alert("Already has this city");
        } else {
            // add city to the list and generate bttn
            cityList.push(upper);
            var bttn = $("<button>");
            bttn.attr("data-name", upper);
            bttn.text(upper);
            bttn.addClass("city btn btn-lg btn-primary");
            $("#buttonDiv").append(bttn);
        };
    };

    // get 5 day forecast
    function fiveDayForecast() {
        event.preventDefault();
        $("#forecastDiv").empty();
        var cityName = $("#input").val();
        // URL 
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=" + cityName + "&appid=" + APIKey;
        //AJAX
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var list = response.list;
            // get details from the response
            for (var i = 0; i < list.length; i = i + 8) {
                var cardTitle = list[i].dt_txt;
                var temp = list[i].main.temp;
                var wind = list[i].wind.speed;
                var hum = list[i].main.humidity;
                var weather = list[i].weather[0].main;
                var weatherDescription = list[i].weather[0].description;
                // use the information to create card for each day
                createCard(cardTitle, wind, hum, temp, weather, weatherDescription);
            };
            console.log(response.list);
            console.log(cardTitle);
        });

    };

    // create cards for 5 day forecast with details
    function createCard(cardTitle, wind, hum, temp, weather, weatherDescription) {
        var colDiv = $("<div>");
        colDiv.addClass("col-lg-4 col-md-6 col-sm-6 col-12 w-auto");
        var cardDiv = $("<div>");
        cardDiv.addClass("card cardMargin w-auto");
        var cardBodyDiv = $("<div>");
        cardBodyDiv.addClass("card-body");
        var cardTitle = $("<h5>");
        cardTitle.text(cardTitle);
        var descriptionP = $("<p>");
        descriptionP.text(weatherDescription);
        var icon = $("<i>");
        icon.addClass("fas fa-2x");
        // check the weather icon
        if (weather == "Snow") {
            icon.addClass("fa-snowflake").removeClass("fa-sun fa-cloud fa-cloud-rain fa-cloud-showers-heavy fa-bolt fa-exclamation-circle");
        } else if (weather == "Clear") {
            icon.addClass("fa-sun").removeClass("fa-cloud fa-cloud-rain fa-cloud-showers-heavy fa-snowflake fa-bolt fa-exclamation-circle");
        } else if (weather == "Clouds") {
            icon.addClass("fa-cloud").removeClass("fa-sun fa-cloud-rain fa-cloud-showers-heavy fa-snowflake fa-bolt fa-exclamation-circle");
        } else if (weather == "Rain") {
            icon.addClass("fa-cloud-showers-heavy").removeClass("fa-sun fa-cloud fa-cloud-rain fa-snowflake fa-bolt fa-exclamation-circle");
        } else if (weather == "Thunderstorm") {
            icon.addClass("fa-bolt").removeClass("fa-sun fa-cloud fa-cloud-rain fa-snowflake fa-cloud-showers-heavy fa-exclamation-circle");
        } else if (weather == "Drizzle") {
            icon.addClass("fa-cloud-rain").removeClass("fa-sun fa-cloud fa-cloud-showers-heavy fa-snowflake fa-bolt fa-exclamation-circle");
        } else {
            icon.addClass("fa-exclamation-circle").removeClass("fa-cloud-rain fa-sun fa-cloud fa-cloud-showers-heavy fa-snowflake fa-bolt");
        };
        var windP = $("<p>");
        windP.text("Wind speed: " + wind + " m/s");
        var humP = $("<p>");
        humP.text("Humidity: " + hum + "%");
        var tempP = $("<p>");
        tempP.text("Temperature: " + temp + " °C");
        // append all elements
        cardBodyDiv.append(cardTitle, icon, descriptionP, windP, humP, tempP);
        cardDiv.append(cardBodyDiv);
        colDiv.append(cardDiv);
        $("#forecastDiv").append(colDiv);
    };

    // display city bttn from local storage
    function displayBttn() {
        var cityList = JSON.parse(localStorage.getItem("cityList"));
        if (!cityList) {
            return;
        };
        for (var i = 0; i < cityList.length; i++) {
            var bttn = $("<button>");
            bttn.attr("data-name", cityList[i]);
            bttn.text(cityList[i]);
            bttn.addClass("city btn btn-lg btn-primary");
            $("#buttonDiv").append(bttn);
        };
    };

    // showing weather information from bttn
    function displayInfo() {
        // get input value
        var city = $(this).attr("data-name");
        // URL 
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=" + city + "&appid=" + APIKey;
        //AJAX
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            $("#cityTitle").text(city);
            $(".wind").text(response.wind.speed + " m/s");
            $(".humidity").text(response.main.humidity + "%");
            $(".temp").text(response.main.temp + " °C");
            $(".weather").css("display", "block");
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            getUVIndex(lat, lon);
            var weather = response.weather[0].main;
            changeIcon(weather);
            $("#description").text(response.weather[0].description);
        }).then(function () {
            var URL = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=" + city + "&appid=" + APIKey;
            //AJAX
            $.ajax({
                url: URL,
                method: "GET"
            }).then(function (response) {
                $("#forecastDiv").empty();
                var list = response.list;
                for (var i = 0; i < list.length; i = i + 8) {
                    var cardTitle = list[i].dt_txt;
                    var temp = list[i].main.temp;
                    var wind = list[i].wind.speed;
                    var hum = list[i].main.humidity;
                    var weather = list[i].weather[0].main;
                    var weatherDescription = list[i].weather[0].description;
                    createCard(cardTitle, wind, hum, temp, weather, weatherDescription);
                };
            });
        });



    };

    // change weather icons
    function changeIcon(weather) {
        if (weather == "Snow") {
            $("#currentIcon").addClass("fa-snowflake").removeClass("fa-sun fa-cloud fa-cloud-rain fa-cloud-showers-heavy fa-bolt fa-exclamation-circle");
        } else if (weather == "Clear") {
            $("#currentIcon").addClass("fa-sun").removeClass("fa-cloud fa-cloud-rain fa-cloud-showers-heavy fa-snowflake fa-bolt fa-exclamation-circle");
        } else if (weather == "Clouds") {
            $("#currentIcon").addClass("fa-cloud").removeClass("fa-sun fa-cloud-rain fa-cloud-showers-heavy fa-snowflake fa-bolt fa-exclamation-circle");
        } else if (weather == "Rain") {
            $("#currentIcon").addClass("fa-cloud-showers-heavy").removeClass("fa-sun fa-cloud fa-cloud-rain fa-snowflake fa-bolt fa-exclamation-circle");
        } else if (weather == "Thunderstorm") {
            $("#currentIcon").addClass("fa-bolt").removeClass("fa-sun fa-cloud fa-cloud-rain fa-snowflake fa-cloud-showers-heavy fa-exclamation-circle");
        } else if (weather == "Drizzle") {
            $("#currentIcon").addClass("fa-cloud-rain").removeClass("fa-sun fa-cloud fa-cloud-showers-heavy fa-snowflake fa-bolt fa-exclamation-circle");
        } else {
            $("#currentIcon").addClass("fa-exclamation-circle").removeClass("fa-cloud-rain fa-sun fa-cloud fa-cloud-showers-heavy fa-snowflake fa-bolt");
        };
    };
});
