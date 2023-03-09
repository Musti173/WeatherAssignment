function addInfo(city) {
    const addedList = getInfo();
    if (!addedList.includes(city)) {
      addedList.push(city);
      localStorage.setItem("city", JSON.stringify(addedList));
    }
  }
  
  function getCityCode(cityName) {
    const city = cityName ? cityName : document.getElementById("city").value;
    const apiKey = "da651d05e4f8445435fe5d5570543601";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const lon = data.coord.lon;
        const lat = data.coord.lat;
        console.log(`The coordinates of ${city} are lon: ${lon}, lat: ${lat}.`);
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        return fetch(forecastUrl);
      })
      .then((response) => response.json())
      .then((data) => {
        const forecastContainer = document.getElementById("forecast-cards");
        forecastContainer.innerHTML = "";
  
        let currentDate = new Date().getDate();
        let counter = 0;
  
        data.list.forEach((forecast) => {
          const date = new Date(forecast.dt * 1000);
          const forecastDate = date.getDate();
          const temperature = forecast.main.temp;
          const humidity = forecast.main.humidity;
          const windSpeedInMPS = forecast.wind.speed;
          const windSpeedInMPH = (windSpeedInMPS * 2.237).toFixed(1);
          const description = forecast.weather[0].description;
          const iconCode = forecast.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
          const forecastContainer = document.getElementById("forecast-cards");
  
          
          if (forecastDate !== currentDate) {
            currentDate = forecastDate;
            counter++;
          } else {
            return;
          }
 
          if (counter <= 5) {
            const forecastItem = document.createElement("div");
            forecastItem.classList.add("card");
            forecastItem.innerHTML = `
            <div class="card-body">
            <img src="${iconUrl}" alt="${description}" class="card-img-top">
            <p class="forecast-title">${city}</h5>
            <p class="card-text">${date.toLocaleDateString()}</h5>
            <p class="card-text">Temperature: ${temperature} &deg;C</p>
            <p class="card-text">Humidity: ${humidity}</p>
            <p class="card-text">Wind Speed: ${windSpeedInMPH} MPH</p>
            <p class="card-text">Description: ${description}</p>
          </div>
              `;
            forecastContainer.appendChild(forecastItem);
          }
        });
  
        
        addInfo(city);
        updateCityList();
      })
      .catch((error) => console.log(error));
  }
  
 
  function getInfo() {
    let cityList = [];
    const storedList = localStorage.getItem("city");
    if (storedList !== null) {
      cityList = JSON.parse(storedList);
    }
    return cityList;
  }
  
 function updateCityList() {
    
    const cityList = getInfo();
  
   
    const cityListElement = document.getElementById("cityList");
    cityListElement.innerHTML = "";
  
   
    cityList.forEach((city) => {
      const listItem = document.createElement("li");
      listItem.textContent = city;
  
      
      listItem.addEventListener("click", () => getCityCode(city));
  
      
      cityListElement.appendChild(listItem);
    });
  }
  
  function displayCityList() {
    const cityList = JSON.parse(localStorage.getItem("cityList")) || [];
  
    const cityListElement = document.getElementById("cityList");
    cityListElement.innerHTML = "";
  
    cityList.forEach((city) => {
      const li = document.createElement("li");
      li.textContent = city;
      li.addEventListener("click", () => getWeather(city));
      cityListElement.appendChild(li);
    });
  }
  
  function loadCitiesFromStorage() {
    const cityList = getInfo();
    const cityListElement = document.getElementById("cityList");
    cityListElement.innerHTML = "";
    cityList.forEach((city) => {
      const listItem = document.createElement("li");
      listItem.textContent = city;
      listItem.addEventListener("click", () => getCityCode(city));
      cityListElement.appendChild(listItem);
    });
  }
  
  

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("search-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault(); 
      getCityCode();
    });
    loadCitiesFromStorage();
  });