import { ui } from './modules/ui.js';
import { ls, sp } from './modules/storage.js';
import { gl, weather } from './modules/weather.js';

window.onload = function () {
    // get parsed places from local storage and store them inside storedPlaces array
    ls.get();
    // placesArray variable gets the value of storedPlaces array
    let placesArray = ls.getStoredPlaces();
    // if there are any places inside the local storage
    if (placesArray.length !== 0) {
        // display each stored place inside the storage panel
        placesArray.forEach(place => sp.displayPlaceInStoragePanel(place));
        // get weather for the last place stored
        weather.getWeather(placesArray[placesArray.length - 1], false);
    } else {
        // hide sections if local storage is empty array
        ui.hideSections();
        // show app with the "beograd" as a default place set in a local storage
        ui.showApp();
    }
}
