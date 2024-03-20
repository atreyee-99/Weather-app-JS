document.addEventListener('DOMContentLoaded', function() {
    updateBackground('default');
});

document.body.addEventListener('click', function(event) {
    const suggestionsDiv = document.getElementById('suggestions');
    const locationInput = document.getElementById('location');
    
    // Check if the click event occurred outside of the suggestions div and location input
    if (!event.target.closest('#suggestions') && !event.target.closest('#location')) {
        suggestionsDiv.innerHTML = ''; // Collapse the suggestions dropdown
        locationInput.blur(); // Remove focus from the input
    }
});

document.getElementById('getWeatherButton').addEventListener('click', getWeather);
document.getElementById('resetButton').addEventListener('click', resetWeather);
document.getElementById('location').addEventListener('input', autocomplete);

let allCities = [];

fetch('https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/master/countries.json')
    .then(response => response.json())
    .then(data => {
        for (const countryName in data) {
            if (data.hasOwnProperty(countryName)) {
                const countryData = data[countryName];
                for (const cityName of countryData) {
                    allCities.push(cityName);
                }
            }
        }
    })
    .catch(error => {
        console.log('Error fetching city data:', error);
    });

function autocomplete() {
    const inputValue = this.value.trim().toLowerCase();
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = '';

    if (inputValue.length >= 2) {
        const matchingCities = allCities.filter(city => city.toLowerCase().startsWith(inputValue));
        matchingCities.forEach(city => {
            const suggestion = document.createElement('div');
            suggestion.textContent = city;
            suggestion.classList.add('suggestion');
            suggestion.addEventListener('click', () => {
                document.getElementById('location').value = city;
                suggestionsDiv.innerHTML = '';
            });
            suggestionsDiv.appendChild(suggestion);
        });
    }
}

function getWeather() {
    const locationInput = document.getElementById('location').value;
    if (!locationInput) {
        alert('Please enter a city name before getting weather information.');
        return;
    }
    const apiKey = '1bfc2415e4bf08aacd065a7719a4f089';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${locationInput}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        return response.json();
        })
        .then(data => {
            console.log('Weather data for ' + data.name + ": ");
            console.log(data);
            displayWeatherInfo(data);
            updateBackground(data.weather[0].description);
        })
        .catch(error => {
            console.log('Error fetching weather data:', error);
        });
}

function displayWeatherInfo(data) {
    const weatherDetailsDiv = document.getElementById('weather-details');
    const weatherCondition = data.weather[0].description.toLowerCase();
    const capitalizedCondition = weatherCondition.charAt(0).toUpperCase() + weatherCondition.slice(1);

    //icons based on weather condition
    let weatherIconClass = '';
    if (weatherCondition.includes('clear') || weatherCondition.includes('clear sky')) {
        weatherIconClass = 'fas fa-sun';
    } else if (weatherCondition.includes('cloud') || weatherCondition.includes('overcast')) {
        weatherIconClass = 'fas fa-cloud';
    } else if (weatherCondition.includes('rain')) {
        weatherIconClass = 'fas fa-cloud-showers-heavy';
    } 
    else if (weatherCondition.includes('haze') || weatherCondition.includes('fog') || weatherCondition.includes('smoke')) {
        weatherIconClass = 'fas fa-smog';
    } else if (weatherCondition.includes('storm') || weatherCondition.includes('thunder')) {
        weatherIconClass = 'fas fa-bolt';
    } 
    else {
        weatherIconClass = 'fas fa-question-circle';
    }

    weatherDetailsDiv.innerHTML = `
    <div class="card weather-card">
        <div class="card-body">
            <h2>Temperature in ${data.name}</h2>
            <p class="card-text temperature-value">
                ${data.main.temp}
                <span class="degree-symbol">&deg;C</span>
            </p>
            <p><b>Feels Like:</b> ${data.main.feels_like}°C</p>
        </div>
    </div>
    <div class="card weather-card">
        <h2>Other Weather Details</h2>
        <p><b>Humidity: </b>${data.main.humidity}%</p>
        <p><b>Pressure: </b>${data.main.pressure} hPa</p>
        <p><b>Wind Speed: </b>${data.wind.speed} kmph</p>
    </div>
    <div class="card weather-card">
        <h2>Weather Condition</h2>
        <i class="${weatherIconClass} fa-4x"></i>
        <p>${capitalizedCondition}</p>
    </div>
    `;
    weatherDetailsDiv.classList.add('show');
}

function resetWeather() {
    const locationInput = document.getElementById('location').value;
    if (!locationInput) {
        alert('There is no weather detail to reset!');
        return;
    }
    updateBackground('default');
    document.getElementById('location').value = '';
    // document.getElementById('weather-info').innerHTML = '';
    // document.getElementById('weather-info').classList.remove('show');
    document.getElementById('weather-details').innerHTML = '';
    document.getElementById('weather-details').classList.remove('show');
}

function updateBackground(description) {
    const body = document.querySelector('body');
    const lowercaseDescription = description.toLowerCase();

    if (lowercaseDescription.includes('clear') || lowercaseDescription.includes('clear sky')) {
        body.style.backgroundImage = "url('clear sky.gif')";
    } else if (lowercaseDescription.includes('cloud') || lowercaseDescription.includes('overcast')) {
        body.style.backgroundImage = "url('cloudy_sky.gif')";
    } else if (lowercaseDescription.includes('rain')) {
        body.style.backgroundImage = "url('rainy_sky.gif')";
    } else if (lowercaseDescription.includes('haze') || lowercaseDescription.includes('fog') || lowercaseDescription.includes('smoke')) {
        body.style.backgroundImage = "url('haze.gif')";
    } else if (lowercaseDescription.includes('storm') || lowercaseDescription.includes('thunder')) {
        body.style.backgroundImage = "url('thunderstorm.gif')";
    } else {
        body.style.backgroundImage = "url('default_sky.gif')";
    }
}


function capitalizeString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
