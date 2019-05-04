import { ui } from './ui.js';
import { ls, sp } from './storage.js';

/******************* Get Location *******************/
const GetLocation = function () {
    let location;
    const locationInput = document.querySelector("#location-input");
    const addLocationBtn = document.querySelector("#add-location-btn");

    locationInput.addEventListener("input", function () {
        let inputText = this.value.trim();

        if (inputText !== "") {
            addLocationBtn.removeAttribute("disabled");
            addLocationBtn.classList.remove("disabled");
            addLocationBtn.innerHTML = '<img class="icon-s" src="resources/icons/add-blue.png" alt="Add icon"></img>';
        } else {
            addLocationBtn.setAttribute("disabled", true);
            addLocationBtn.classList.add("disabled");
            addLocationBtn.innerHTML = '<img class="icon-s" src="resources/icons/add-gray.png" alt="Add icon"></img>';
        }
    });

    const _addCity = () => {
        location = locationInput.value;
        locationInput.value = "";
        addLocationBtn.setAttribute("disabled", true);
        addLocationBtn.classList.add("disabled");
        addLocationBtn.innerHTML = '<img class="icon-s" src="resources/icons/add-gray.png" alt="Add icon"></img>';

        // Get weather data
        weather.getWeather(location, true); // stored = true
    }

    addLocationBtn.addEventListener("click", _addCity);
}

/******************* Weather *******************/
const Weather = function () {
    const darkSkyKEY = "845f6922f233e4f6181f3623308d0ef9";
    const openCageKEY = "d3ed8726630e4f90a71508b73b47195c";
    // https://cors-anywhere.herokuapp.com - acts as a proxy to avoid CORS error, and allows making requests even from localhost
    const proxy = "https://cors-anywhere.herokuapp.com/";
    let config = {
        headers: {
            "Origin": "X-Requested-With"
        }
    }

    const _getOpenCageURL = (location) => `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${openCageKEY}`;
    const _getDarkSkyURL = (lat, lng) => `${proxy}https://api.darksky.net/forecast/${darkSkyKEY}/${lat},${lng}`;

    const _getDarkSkyData = (url, location) => {
        axios.get(url)
            .then(res => {
                console.log("DarkSky: res.data", res.data);
                console.log(location);
                ui.displayWeatherData(res.data, location);
            })
            .catch(err => console.error(err));
    }

    const getWeather = (location, stored) => {
        ui.loadApp();
        let openCageURL = _getOpenCageURL(location);

        axios.get(openCageURL)
            .then(res => {
                console.log("OpenCage: res.data.results", res.data.results);
                if (res.data.results.length === 0) {
                    console.error("Nonexistent location.");
                    alert("Nonexistent location.");
                    ui.showApp();
                    return;
                }

                // display location (if it doesn't already exist in Storage)
                if (stored) {
                    let storedLocations = ls.store(location.toLowerCase());
                    if (storedLocations) sp.displayPlaceInStoragePanel(location);
                }

                let lat = res.data.results[0].geometry.lat;
                let lng = res.data.results[0].geometry.lng;

                let darkSkyURL = _getDarkSkyURL(lat, lng);
                _getDarkSkyData(darkSkyURL, location);
            })
            .catch(err => console.error(err));
    }

    return {
        getWeather
    }
}

export const gl = new GetLocation();
export const weather = new Weather();