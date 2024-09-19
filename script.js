let day = document.querySelector('.date-dayname');
let date = document.querySelector('.date-day');
let cityName = document.querySelector('.location');
let weatherIcon = document.querySelector('.weather-icon');
let temperature = document.querySelector('.weather-temp');
let description = document.querySelector('.weather-desc');
let pressure = document.querySelector('#pressure');
let humidity = document.querySelector('#humidity');
let wind = document.querySelector('#wind');
let forecastList = document.querySelector('#forecast-list');

let citySearch = document.querySelector(".location-container");
let cityInput = document.querySelector(".location-search");

// to get the actual country name
const getCountryName = (code) => {
    return new Intl.DisplayNames([code], { type: 'region' }).of(code);
}

// to get the actual date
const getDate = (dt) => {
    const curDate = new Date(dt * 1000);
    const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
    }
    const formatter = new Intl.DateTimeFormat("en-US", options);
    return formatter.format(curDate);
}

// to get the actual day
const getDay = (dt) => {
    const curDate = new Date(dt * 1000);
    const options = {
        weekday: "long",
    }
    const formatter = new Intl.DateTimeFormat("en-US", options);
    return formatter.format(curDate);
}

let city = "hoshiarpur"; // default city

// search functionality
citySearch.addEventListener("submit", (e) => {
    e.preventDefault();
    city = cityInput.value.trim();
    if (city) {
        getWeatherData();
        cityInput.value = "";
    }
});

// Fetch current weather data
const getWeatherData = async () => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=cf03a860bdbebc82e1cb19d0ac8d39b1&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=cf03a860bdbebc82e1cb19d0ac8d39b1&units=metric`;

    try {
        const res = await fetch(weatherUrl);
        if (!res.ok) throw new Error('City not found');
        const data = await res.json();

        const { main, name, weather, wind, sys, dt } = data;
        cityName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
        date.innerHTML = getDate(dt);
        day.innerHTML = getDay(dt);
        weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png"/>`;
        temperature.innerHTML = `${main.temp.toFixed()}&#176;C`;
        description.innerHTML = weather[0].main;
        pressure.innerHTML = `${main.pressure} hPa`;
        humidity.innerHTML = `${main.humidity}%`;
        wind.innerHTML = `${wind.speed} km/h`;

        // Fetch the forecast data
        await getForecastData(forecastUrl);

    } catch (error) {
        console.error(error);
        alert('City not found, please try again.');
    }
}

// Fetch 5-day forecast data
const getForecastData = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Forecast data not found');
        const data = await res.json();

        // Clear previous forecast
        forecastList.innerHTML = '';

        // Iterate through the forecast data and display it
        data.list.forEach((forecast, index) => {
            if (index % 8 === 0) { // Get forecast for every 24 hours (3-hour intervals)
                const dayForecast = document.createElement('li');
                const forecastDate = new Date(forecast.dt * 1000);
                const options = { weekday: 'short' };
                dayForecast.innerHTML = `
                    
                    <span class="dayname">${forecastDate.toLocaleDateString('en-US', options)}</span>
                    <span class="day-temp">${forecast.main.temp.toFixed()}&#176;C</span>
                    <img class= "day-icon" src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}" />
                `;
                forecastList.appendChild(dayForecast);
            }
        });

    } catch (error) {
        console.error(error);
        alert('Forecast data not found, please try again.');
    }
}

// Load default weather data on page load
document.addEventListener('DOMContentLoaded', getWeatherData);
