
document.getElementById('search-button').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    fetchWeatherData(city);
});

async function fetchWeatherData(city) {
    const apiKey = '8038d225a5bc41918ca140924242606'; // Replace 'your_api_key' with your actual API key
    const currentWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;

    displayLoading();
    try {
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl),
        ]);

        if (!currentWeatherResponse.ok || !forecastResponse.ok) {
            throw new Error('City not found');
        }

        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();
        displayWeatherData(currentWeatherData, forecastData);
    } catch (error) {
        displayError(error.message);
    }
}

function displayLoading() {
    const weatherDisplay = document.getElementById('weather-display');
    weatherDisplay.innerHTML = `<p>Loading...</p>`;
}

function displayError(message) {
    const weatherDisplay = document.getElementById('weather-display');
    weatherDisplay.innerHTML = `<p>Error: ${message}</p>`;
}

function displayWeatherData(currentData, forecastData) {
    const weatherDisplay = document.getElementById('weather-display');
    weatherDisplay.innerHTML = `
        <h2>Weather in ${currentData.location.name}</h2>
        <p>Temperature: ${currentData.current.temp_c}°C</p>
        <p>Humidity: ${currentData.current.humidity}%</p>
        <p>Wind Speed: ${currentData.current.wind_kph} kph</p>
        <p>${currentData.current.condition.text}</p>
        <h3>5-Day Forecast</h3>
        <div id="forecast">
            ${forecastData.forecast.forecastday.map(day => `
                <div>
                    <p>${new Date(day.date).toDateString()}</p>
                    <p>Temp: ${day.day.avgtemp_c}°C</p>
                    <p>${day.day.condition.text}</p>
                </div>
            `).join('')}
        </div>
    `;
}
