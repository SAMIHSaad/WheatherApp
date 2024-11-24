// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

// WeatherAPI Key and Base URL
const apiKey = '5470625c1532449b8d4223101242411'; // Replace with your valid API key
const apiBaseUrl = 'https://api.weatherapi.com/v1/forecast.json';

// Function to Fetch Weather Data from WeatherAPI
async function getWeather(city) {
    weatherResult.innerHTML = `<div class="loading-spinner"></div>`; // Show loading spinner

    const url = `${apiBaseUrl}?key=${apiKey}&q=${city}&days=4&aqi=no`; // 'days=4' fetches current weather + 3 days of forecast
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || 'City not found');
        }
        const data = await response.json();
        displayWeather(data);
        displayForecast(data);
    } catch (error) {
        weatherResult.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
    }
}

// Function to Display Current Weather Data
function displayWeather(data) {
    const { location, current } = data;
    const { temp_c, humidity, condition } = current;

    weatherResult.innerHTML = `
        <div class="weather-card">
            <h2>Weather in ${location.name}, ${location.country}</h2>
            <p><strong>${condition.text}</strong></p>
            <p>Temperature: <strong>${temp_c}°C</strong></p>
            <p>Humidity: <strong>${humidity}%</strong></p>
            <img src="https:${condition.icon}" alt="${condition.text}" />
        </div>
    `;
}

// Function to Display Weather Forecast for Next Days
function displayForecast(data) {
    const { forecast } = data;
    const { forecastday } = forecast;

    let forecastHTML = '<div class="forecast-container">';

    forecastday.forEach((day) => {
        const { date, day: forecastDay } = day;
        const { avgtemp_c, condition } = forecastDay;
        const dateObj = new Date(date);
        const dayOfWeek = dateObj.toLocaleString('default', { weekday: 'long' });

        forecastHTML += `
            <div class="forecast-card">
                <p class="forecast-date">${dayOfWeek}, ${dateObj.toLocaleDateString()}</p>
                <p class="forecast-temp">${avgtemp_c}°C</p>
                <p class="forecast-condition">${condition.text}</p>
                <img src="https:${condition.icon}" alt="${condition.text}" />
            </div>
        `;
    });

    forecastHTML += '</div>';
    weatherResult.innerHTML += forecastHTML;
}

// Event Listener for Search Button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        weatherResult.innerHTML = `<p class="error-message">Please enter a city name</p>`;
    }
});
