function FormatDate(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10) {
        hours = `0${hours}` ;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day = days[date.getDay()];
    return `${day} ${hours}:${minutes}`;
    }
    
    function formatDay(timestamp) {
        let date = new Date(timestamp * 1000);
        let day = date.getDay();
        let days = ["Sun", "Mon", "Tue", "wed", "Thu", "Fri", "Sat"];
        
        return days[day];
    }
    
    
    // Display 5‑day forecast using OpenWeather "forecast" (5 day / 3 hour) API
    function displayForcast(response) {
        let list = response.data.list; // 3‑hourly data
        let forcastElement = document.querySelector("#forcast");

        // Pick one representative entry per day (closest to 12:00)
        let daysMap = {};
        list.forEach(function (item) {
            let date = new Date(item.dt * 1000);
            let dayKey = date.toISOString().split("T")[0]; // YYYY‑MM‑DD
            let hour = date.getHours();

            if (!daysMap[dayKey]) {
                daysMap[dayKey] = item;
            } else {
                let existingDate = new Date(daysMap[dayKey].dt * 1000);
                let existingHour = existingDate.getHours();
                if (Math.abs(hour - 12) < Math.abs(existingHour - 12)) {
                    daysMap[dayKey] = item;
                }
            }
        });

        let days = Object.values(daysMap).slice(0, 5); // next 5 days

        let forcastHTML = `<div class="row">`;
        days.forEach(function (forecastItem) {
            forcastHTML =
                forcastHTML +
                `
        <div class="col-2 text-center">
          <div class="Weather-forcast-date">${formatDay(forecastItem.dt)}</div>
          <img src="http://openweathermap.org/img/wn/${forecastItem.weather[0].icon}@2x.png"
               alt="${forecastItem.weather[0].description}"
               width="45" />
          <div class="Weather-forcast-temperature">
            <span class="weather-forcast-max">${Math.round(forecastItem.main.temp_max)}&#176;</span>
            <span class="weather-forcast-min">${Math.round(forecastItem.main.temp_min)}&#176;</span>
          </div>
        </div>
        `;
        });

        forcastHTML = forcastHTML + `</div>`;
        forcastElement.innerHTML = forcastHTML;
    }

    // Call OpenWeather 5‑day / 3‑hour forecast by city name
    function getforecast(city) {
        let apiKey = "9c37ab9fa36516481c5970a9fe2db0eb";
        let units = "metric";
        let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
        axios.get(apiUrl).then(displayForcast);
    }
    
    
    function showTemperature(response) {
        let city = document.querySelector("#city");
        city.innerHTML = response.data.name;
        let descriptionElement = document.querySelector("#description");
        descriptionElement.innerHTML = response.data.weather[0].description;
        let tempElement = document.querySelector("#temp");
         celsiusTemperature = response.data.main.temp;
        tempElement.innerHTML = Math.round(celsiusTemperature);
        let humidityElement = document.querySelector("#humidity");
        humidityElement.innerHTML = response.data.main.humidity;
        let windElement = document.querySelector("#wind");
        windElement.innerHTML = Math.round(response.data.wind.speed);
        let dateElement = document.querySelector("#date");
        dateElement.innerHTML = FormatDate(response.data.dt*1000);
        let iconElement = document.querySelector("#icon");
        iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
        iconElement.setAttribute("alt", response.data.weather[0].description);

        // Also load 5‑day forecast for this city
        getforecast(response.data.name);
    }
    
    function search(city) {
    let apiKey = "9c37ab9fa36516481c5970a9fe2db0eb";
    let units = "metric"
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showTemperature);
    }
    
    function currentSearch(event) {
        event.preventDefault();
        let cityElement = document.querySelector("#input-city");
        search(cityElement.value);
    }

    let form = document.querySelector("#search-form");
    form.addEventListener("submit", currentSearch);

   // When "Clear" is clicked, reset back to Toronto
   function resetToToronto() {
    let cityElement = document.querySelector("#input-city");
    cityElement.value = "";
    search("toronto");
  }
  
  let resetButton = document.querySelector("#reset-default");
  if (resetButton) {
    resetButton.addEventListener("click", resetToToronto);
  }
   

    let celsiusTemperature = null;

    // Initial default view
    search("toronto");