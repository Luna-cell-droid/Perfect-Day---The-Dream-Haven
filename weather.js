document.addEventListener("DOMContentLoaded", () => {

    const locationText = document.getElementById("location");
    const weatherIcon = document.getElementById("weather-icon");
    const temperature = document.getElementById("temperature");
    const condition = document.getElementById("condition");
    const high = document.getElementById("high");
    const low = document.getElementById("low");

    const rain = document.getElementById("rain");
    const feelsLike = document.getElementById("feels-like");
    const wind = document.getElementById("wind");

    const weatherMessage = document.getElementById("weather-message");


    /* --------------------------------
       WEATHER DESCRIPTIONS
    -------------------------------- */

    function getWeatherDescription(code) {

        const descriptions = {
            0: "Clear sky",
            1: "Mostly clear",
            2: "Partly cloudy",
            3: "Cloudy",

            45: "Foggy",
            48: "Foggy",

            51: "Light drizzle",
            53: "Drizzle",
            55: "Heavy drizzle",

            61: "Light rain",
            63: "Rain",
            65: "Heavy rain",

            71: "Light snow",
            73: "Snow",
            75: "Heavy snow",
            77: "Snow",

            80: "Rain showers",
            81: "Rain showers",
            82: "Heavy rain showers",

            95: "Thunderstorm",
            96: "Thunderstorm",
            99: "Thunderstorm"
        };

        return descriptions[code] || "A little mysterious";
    }


    /* --------------------------------
       WEATHER ICONS
    -------------------------------- */

    function getWeatherIcon(code) {

        if (code === 0) {
            return "☀";
        }

        if (code === 1 || code === 2) {
            return "☼";
        }

        if (code === 3) {
            return "☁";
        }

        if (code === 45 || code === 48) {
            return "☁";
        }

        if (code >= 51 && code <= 67) {
            return "☂";
        }

        if (code >= 71 && code <= 77) {
            return "❄";
        }

        if (code >= 80 && code <= 82) {
            return "☂";
        }

        if (code >= 95) {
            return "☁";
        }

        return "☁";
    }


    /* --------------------------------
       LITTLE MESSAGE
    -------------------------------- */

    function getWeatherMessage(code) {

        if (code === 0) {
            return "A little sunshine looks good on today.";
        }

        if (code === 1 || code === 2) {
            return "A soft sky for a soft little day.";
        }

        if (code === 3) {
            return "Cloudy skies, quiet thoughts.";
        }

        if (code >= 51 && code <= 67) {
            return "Let the rain slow the world down for a moment.";
        }

        if (code >= 80 && code <= 82) {
            return "A rainy day is still a day worth keeping.";
        }

        if (code >= 95) {
            return "Stay cosy and let the storm pass.";
        }

        return "Whatever the weather, make today yours.";
    }


    /* --------------------------------
       LOAD WEATHER
    -------------------------------- */

    async function loadWeather(latitude, longitude) {

        try {

            const url =
                `https://api.open-meteo.com/v1/forecast` +
                `?latitude=${latitude}` +
                `&longitude=${longitude}` +
                `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m` +
                `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
                `&timezone=auto`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Weather request failed");
            }

            const data = await response.json();


            /* CURRENT WEATHER */

            const currentTemperature =
                Math.round(data.current.temperature_2m);

            const currentFeelsLike =
                Math.round(data.current.apparent_temperature);

            const currentWind =
                Math.round(data.current.wind_speed_10m);

            const currentCode =
                data.current.weather_code;


            /* TODAY'S HIGH + LOW */

            const todayHigh =
                Math.round(data.daily.temperature_2m_max[0]);

            const todayLow =
                Math.round(data.daily.temperature_2m_min[0]);


            /* RAIN */

            const rainChance =
                data.daily.precipitation_probability_max[0];


            /* PUT EVERYTHING ON THE PAGE */

            temperature.textContent = currentTemperature;

            condition.textContent =
                getWeatherDescription(currentCode);

            weatherIcon.textContent =
                getWeatherIcon(currentCode);

            high.textContent =
                `${todayHigh}°`;

            low.textContent =
                `${todayLow}°`;

            rain.textContent =
                `${rainChance}%`;

            feelsLike.textContent =
                `${currentFeelsLike}°`;

            wind.textContent =
                `${currentWind} km/h`;

            weatherMessage.textContent =
                getWeatherMessage(currentCode);


            /* GET LOCATION NAME */

            getLocationName(latitude, longitude);

        }

        catch (error) {

            console.error("Weather error:", error);

            condition.textContent =
                "The weather wandered away...";

            locationText.textContent =
                "Location unavailable";

        }

    }


    /* --------------------------------
       GET CITY / LOCATION NAME
    -------------------------------- */

    async function getLocationName(latitude, longitude) {

        try {

            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );

            const data = await response.json();

            const city =
                data.city ||
                data.locality ||
                data.principalSubdivision ||
                "Your location";

            locationText.textContent = city;

        }

        catch (error) {

            console.log("Couldn't find location name.");

            locationText.textContent =
                "Your location";

        }

    }


    /* --------------------------------
       GET USER LOCATION
    -------------------------------- */

    function getUserLocation() {

        if (!navigator.geolocation) {

            locationText.textContent =
                "Location unavailable";

            condition.textContent =
                "Your browser doesn't support location.";

            return;
        }


        navigator.geolocation.getCurrentPosition(

            (position) => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                loadWeather(latitude, longitude);

            },

            (error) => {

                console.error("Location error:", error);

                locationText.textContent =
                    "Location unavailable";

                condition.textContent =
                    "Allow location access to see your weather.";

            }

        );

    }


    /* --------------------------------
       START
    -------------------------------- */

    getUserLocation();

});