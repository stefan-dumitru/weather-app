const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('click', async (e) => {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    const weatherData = await getWeatherDataByCoords(lat, lon);
    const forecastData = await getForecastDataByCoords(lat, lon);

    displayWeatherData(weatherData);
    displayForecastData(forecastData);
});

document.getElementById("location-input").addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const location = document.getElementById("location-input").value;
        const weatherData = await getWeatherData(location);
        const forecastData = await getForecastData(location);
        displayWeatherData(weatherData);
        displayForecastData(forecastData);
    }
});

document.getElementById("current-weather-btn").addEventListener('click', async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const weatherData = await getWeatherDataByCoords(lat, lon);
            const forecastData = await getForecastDataByCoords(lat, lon);
            displayWeatherData(weatherData);
            displayForecastData(forecastData);
        }, (error) => {
            console.error(error);
            alert("Unable to retrieve your location. Please enter a location manually.");
        });
    } else {
        alert("Geolocation is not supported by this browser. Please enter a location manually.");
    }
});
    
const getWeatherData = async (location) => {
    if (!location) {
        return {};
    }
    
    const apiKey = '35c9ad6887aab506cbcce3e9f9750e45';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error("Weather data not found");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return {};
    }
}

const getWeatherDataByCoords = async (lat, lon) => {
    const apiKey = '35c9ad6887aab506cbcce3e9f9750e45';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error("Weather data not found");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return {};
    }
}
    
const getForecastData = async (location) => {
    if (!location) {
        return {};
    }
    
    const apiKey = '35c9ad6887aab506cbcce3e9f9750e45';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error("Forecast data not found");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return {};
    }
}

const getForecastDataByCoords = async (lat, lon) => {
    const apiKey = '35c9ad6887aab506cbcce3e9f9750e45';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error("Forecast data not found");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return {};
    }
}
    
function getBackgroundColor(temperature) {
    if (temperature < 0) {
        return 'lightblue';
    } else if (temperature < 10) {
        return 'lightgreen';
    } else if (temperature < 20) {
        return 'lightyellow';
    } else if (temperature < 30) {
        return 'lightsalmon';
    } else {
        return 'lightcoral';
    }
}
    
const displayWeatherData = (data) => {
    const weatherDataElement = document.getElementById("weather-data");
    
    if (Object.keys(data).length === 0) {
        weatherDataElement.innerHTML = "Please enter a valid location to see the weather.";
    } else {
        const temperature = Math.floor(data.main.temp - 273.15);
        const backgroundColor = getBackgroundColor(temperature);
        weatherDataElement.style.backgroundColor = backgroundColor;
    
        weatherDataElement.innerHTML = `
            <h3>${data.name}</h3>
            <p>Temperature: ${temperature}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    }
}
    
const displayForecastData = (data) => {
    const forecastDataElement = document.getElementById("forecast-data");
    
    if (Object.keys(data).length === 0) {
        forecastDataElement.innerHTML = "Unable to fetch forecast data.";
    } else {
        let forecastHTML = '<h3>5-Day Forecast</h3>';
        const forecastList = data.list.filter((_, index) => index % 8 === 0);
    
        forecastList.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const temperature = Math.floor(forecast.main.temp - 273.15);
            forecastHTML += `
                <div class="forecast-day">
                    <h4>${date.toDateString()}</h4>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                    <p>Wind Speed: ${forecast.wind.speed} m/s</p>
                </div>
            `;
        });
    
        forecastDataElement.innerHTML = forecastHTML;
    }
}