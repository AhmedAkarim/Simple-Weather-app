// Variable Declarations

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const errorUI = document.getElementById('error');
const errorHeading = document.querySelector(".errorHeading");
const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading")
const cityName = document.getElementById("cityName");
const dateTime = document.getElementById("dateTime");
const weatherDescription = document.getElementById("weatherDescription");
const weatherDisplay = document.getElementById("weatherDisplay")
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");
const tempMax = document.getElementById("tempMax");
const tempMin = document.getElementById("tempMin");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const cloudiness = document.getElementById('cloudiness');
const sunset = document.getElementById("sunset");
const sunrise = document.getElementById("sunrise")

const apiKey = 'e66897ce52ceeb768c16a537a9e38199';


function kelvinToCelsius(temp) {
    let celsiusTemp = temp - 273.15;
    return celsiusTemp.toFixed(1)
}

function meterToKm(meter) {
    return meter / 1000
}

function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`

    weatherDescription.textContent = data.weather[0].description;
    temperature.textContent = `${kelvinToCelsius(data.main.temp)}°`
    tempMax.textContent = `${kelvinToCelsius(data.main.temp_max)}°`
    tempMin.textContent = `${kelvinToCelsius(data.main.temp_min)}°`
    feelsLike.textContent = `${kelvinToCelsius(data.main.feels_like)}°`
    humidity.textContent = `${data.main.humidity}%`
    windSpeed.textContent = `${data.wind.speed} m/s`
    pressure.textContent = `${data.main.pressure} hPa`
    visibility.textContent = `${meterToKm(data.visibility)} km`
    cloudiness.textContent = `${data.clouds.all} %`;

            
            
    // Date & Time
    const timestamp = data.dt;
    const timezoneOffset = data.timezone;
            
    // Adjust timestamp for local timezone
    const localDate = new Date((timestamp + timezoneOffset) * 1000);
    // console.log(localDate);
            
            
    // Get individual components in UTC (which is now actually local time)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
    const dayName = days[localDate.getUTCDay()];
    const monthName = months[localDate.getUTCMonth()];
    const day = localDate.getUTCDate();
    const year = localDate.getUTCFullYear();
            
    let hours = localDate.getUTCHours();
    const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
            
    const formattedDateTime = `${dayName}, ${monthName} ${day}, ${year} - ${hours}:${minutes} ${ampm}`;
    // console.log(formattedDateTime);
            
    dateTime.textContent = formattedDateTime
            
    // Sunrise and Sunset
    const sunriseDate = new Date((data.sys.sunrise + data.timezone) * 1000);
    const sunriseHours = sunriseDate.getUTCHours() % 12 || 12;
    const sunriseMinutes = sunriseDate.getUTCMinutes().toString().padStart(2, '0');
    const sunriseAMPM = sunriseDate.getUTCHours() >= 12 ? 'PM' : 'AM';
    const sunriseTime = `${sunriseHours}:${sunriseMinutes} ${sunriseAMPM}`;
            
    const sunsetDate = new Date((data.sys.sunset + data.timezone) * 1000);
    const sunsetHours = sunsetDate.getUTCHours() % 12 || 12;
    const sunsetMinutes = sunsetDate.getUTCMinutes().toString().padStart(2, '0');
    const sunsetAMPM = sunsetDate.getUTCHours() >= 12 ? 'PM' : 'AM';
    const sunsetTime = `${sunsetHours}:${sunsetMinutes} ${sunsetAMPM}`;
            
    sunset.textContent = sunsetTime;
    sunrise.textContent = sunriseTime;
}


async function getWeather(city) {

        try {
            const delay = new Promise((resolve) => {
                setTimeout(() => {
                // What should go here to mark the promise as complete?
                resolve()
                }, 2000);
            });

            const response = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);

            Promise.all([delay, response]).then(async (results) => {
                loading.classList.add('hidden')
                const fetchResponse = results[1];
                if (fetchResponse.ok) {
                    const data = await fetchResponse.json();
                    displayWeather(data);
                    errorUI.classList.add("hidden");
                    weatherDisplay.classList.remove("hidden");
                } else {
                    errorUI.classList.remove("hidden");
                    weatherDisplay.classList.add("hidden");
                    errorHeading.textContent = "City not found!";
                    errorMessage.textContent = "Please check the city name and try again."
                }
            }).catch((error) => {
                errorUI.classList.remove("hidden");
                weatherDisplay.classList.add("hidden");
                errorHeading.textContent = `${error.message}`;
                errorMessage.textContent = "Please check the city name and try again."
            }).finally(() => { 
                loading.classList.add("hidden");
            })

            
            
            
            // weatherDisplay.classList.remove("hidden");
            // errorUI.classList.add("hidden");
            
        } catch (error) {
            errorUI.classList.remove("hidden");
            weatherDisplay.classList.add("hidden")
            console.log(error.message);
            errorHeading.textContent = `${error.message}`;
            errorMessage.textContent = "Please check the city name and try again."
            
        }
        
}


function performSearch() {
    
    loading.classList.remove("hidden")
    errorUI.classList.add("hidden")
    weatherDisplay.classList.add('hidden')
    
    let cityInputValue = cityInput.value;
    if (cityInputValue == "") {
        errorUI.classList.remove("hidden")
        loading.classList.add("hidden")
        weatherDisplay.classList.add('hidden')
        errorHeading.textContent = "No City detected";
        errorMessage.textContent = "Please enter a city name to see the result"
    } else {
        loading.classList.remove("hidden")
        errorUI.classList.add("hidden")
        weatherDisplay.classList.add('hidden')
        getWeather(cityInputValue)
    }
    

    
}

searchBtn.addEventListener("click", function(e) {
    
    performSearch()
    
})

cityInput.addEventListener("keydown", function(e) {
    
    if (e.key === 'Enter') {
        performSearch();
    }
    
})
