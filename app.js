document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "FqeJGqEGZ8tT1K8OP26Gf8GwRNsmeHGY"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const dailyDiv = document.getElementById("daily");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetch5DayForecast(locationKey);   // Fetch 5-day forecast
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const currentWeatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }


    function fetch5DayForecast(locationKey) {
        const dailyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(dailyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    display5DayForecast(data.DailyForecasts);
                } else {
                    dailyDiv.innerHTML += `<p>No 5-day forecast available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching 5-day forecast:", error);
                dailyDiv.innerHTML += `<p>Error fetching 5-day forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }



    function display5DayForecast(forecasts) {
        let forecastContent = `<h2>5-Day Forecast</h2>`;
        forecasts.forEach(forecast => {
            const date = new Date(forecast.Date);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            const temperatureMin = forecast.Temperature.Minimum.Value;
            const temperatureMax = forecast.Temperature.Maximum.Value;
            forecastContent += `
                <p>${day}: ${temperatureMin}°C - ${temperatureMax}°C</p>
            `;
        });
        dailyDiv.innerHTML += forecastContent;
    }
});
