// day, date
var date;
var day;
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

var time = Date.UTC(2020, 02, 27);

var uvIndex;

$(document).ready(function () {
    displayBttn();

    var APIKey = "e8c4953eaa486f7433658a72934020a9";
    var cityList = [];

    $("#search").click(fiveDayForecast);

    function getWeather() {
        event.preventDefault();
        // get input value
        var cityName = $("#input").val();
        cityList.push(cityName);
        // URL 
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=" + cityName + "&appid=" + APIKey;
        //AJAX
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // show information
            $("h2").text(cityName);
            $(".wind").text(response.wind.speed);
            $(".humidity").text(response.main.humidity);
            $(".temp").text(response.main.temp);
            // show icons
            var weather = response.weather[0].main;
            changeIcon(weather);
            $("#description").text(response.weather[0].description);
            // get coordinates
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            // call function to get uv index
            getUVIndex(lat, lon);
        });
        // generate the buttons
        var bttn = $("<button>");
        bttn.attr("data-name", cityName);
        bttn.text(cityName);
        bttn.addClass("city btn btn-lg btn-primary");
        $("#buttonDiv").append(bttn);

        // local storage
        localStorage.setItem("cityList", JSON.stringify(cityList))
        $("#input").val("");
    };

    // get uv index
    function getUVIndex(lat, lon) {
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (response) {
            $(".uv").text(response.value);
            if (response.value < 3) {
                $("#uvIndex").css("color", "green");
                $(".uv").css("color", "green");
                $(".warning").text("Low");
                $(".warning").css("backgroundColor", "green");
            } else if (response.value < 6) {
                $("#uvIndex").css("color", "rgb(255, 217, 4)");
                $(".uv").css("color", "rgb(255, 217, 4)");
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

    function fiveDayForecast() {
        event.preventDefault();
        var cityName = $("#input").val();
        cityList.push(cityName);
        // URL 
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=" + cityName + "&appid=" + APIKey;
        //AJAX
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response.list[0].dt_txt);
            console.log(time);
        });

    };

    function displayBttn() {
        var array = JSON.parse(localStorage.getItem("cityList"));
        if (!array) {
            return;
        };
        for (var i = 0; i < array.length; i++) {
            var bttn = $("<button>");
            bttn.attr("data-name", array[i]);
            bttn.text(array[i]);
            bttn.addClass("city btn btn-lg btn-primary");
            $("#buttonDiv").append(bttn);
        };
    };

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
            $("h2").text(city);
            $(".wind").text(response.wind.speed);
            $(".humidity").text(response.main.humidity);
            $(".temp").text(response.main.temp);
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            getUVIndex(lat, lon);

            var weather = response.weather[0].main;
            changeIcon(weather);
            $("#description").text(response.weather[0].description);
        });
    };

    function changeIcon(weather) {
        if (weather == "Snow") {
            $("i").addClass("fa-snowflake").removeClass("fa-sun fa-cloud fa-cloud-rain fa-cloud-showers-heavy fa-bolt fa-exclamation-circle");
        } else if (weather == "Clear") {
            $("i").addClass("fa-sun").removeClass("fa-cloud fa-cloud-rain fa-cloud-showers-heavy fa-snowflake fa-bolt fa-exclamation-circle");
        } else if (weather == "Clouds") {
            $("i").addClass("fa-cloud").removeClass("fa-sun fa-cloud-rain fa-cloud-showers-heavy fa-snowflake fa-bolt fa-exclamation-circle");
        } else if (weather == "Rain") {
            $("i").addClass("fa-cloud-showers-heavy").removeClass("fa-sun fa-cloud fa-cloud-rain fa-snowflake fa-bolt fa-exclamation-circle");
        } else if (weather == "Thunderstorm") {
            $("i").addClass("fa-bolt").removeClass("fa-sun fa-cloud fa-cloud-rain fa-snowflake fa-cloud-showers-heavy fa-exclamation-circle");
        } else if (weather == "Drizzle") {
            $("i").addClass("fa-cloud-rain").removeClass("fa-sun fa-cloud fa-cloud-showers-heavy fa-snowflake fa-bolt fa-exclamation-circle");
        } else {
            $("i").addClass("fa-exclamation-circle").removeClass("fa-cloud-rain fa-sun fa-cloud fa-cloud-showers-heavy fa-snowflake fa-bolt");
        };
    };


    $(document).on("click", ".city", displayInfo);

});


