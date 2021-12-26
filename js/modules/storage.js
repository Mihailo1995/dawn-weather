import { weather } from './weather.js'



/******************* LocalStorage *******************/
const LocalStorage = function() {
  let storedPlaces = []
  let defaultPlace = 'beograd'

  const store = (place) => {
    if (localStorage.getItem('storedPlaces').includes(place)) {
      alert('This location is already stored.')
      return false
    } else {
      storedPlaces.push(place)
      localStorage.setItem('storedPlaces', JSON.stringify(storedPlaces))
      return true
    }
  }

  const get = () => {
    if (localStorage.getItem('storedPlaces') !== null) {
      storedPlaces = JSON.parse(localStorage.getItem('storedPlaces'))
    } else {
      storedPlaces.push(defaultPlace)
      localStorage.setItem('storedPlaces', JSON.stringify(storedPlaces))
    }
  }

  const remove = (index) => {
    if (index < storedPlaces.length) {
      storedPlaces.splice(index, 1)
      localStorage.setItem('storedPlaces', JSON.stringify(storedPlaces))
      // location.reload()
    }
  }

  // get the storedPlaces array
  const getStoredPlaces = () => storedPlaces

  return {
    store,
    get,
    remove,
    getStoredPlaces
  }
}


/******************* Stored Places *******************/
// this function is responsible for displaying stored places from the local storage on the screen and from here user is able to delete or switch between the places he wants to display
const StoredPlaces = function() {
  const storedPlacesDiv = document.querySelector('#stored-places-div')

  const displayPlaceInStoragePanel = (place) => {
    let placeBox = document.createElement('div')
    let placeDiv = document.createElement('div')
    let deleteDiv = document.createElement('div')
    let placeH1 = document.createElement('h1')
    let deleteBtn = document.createElement('button')

    placeBox.classList.add('display-flex', 'stored-place-box')
    placeH1.textContent = place.toLowerCase()
    placeH1.classList.add('set-place')
    placeDiv.classList.add('set-place')
    placeDiv.append(placeH1)
    placeBox.append(placeDiv)
    deleteBtn.classList.add('remove-stored-place')
    deleteBtn.setAttribute('title', 'Delete')
    deleteBtn.innerHTML = '&#10060'
    deleteDiv.append(deleteBtn)
    placeBox.append(deleteDiv)
    storedPlacesDiv.append(placeBox)
  }

  const _deletePlace = (xBtn) => {
    let arrayOfDivs = Array.from(storedPlacesDiv.children)
    let placeBox = xBtn.closest('.stored-place-box')
    let placeIndex = arrayOfDivs.indexOf(placeBox)
    ls.remove(placeIndex)
    placeBox.remove()
  }

  const _targetedXBtnDeletePlace = (e) => {
    if (e.target.classList.contains('remove-stored-place')) {
      _deletePlace(e.target)
    }
  }

  document.onclick = _targetedXBtnDeletePlace

  // clicking on element.set-place (place name) will by if(stored===false) skip storing clicked place in local storage (bcs it already exists in it) and through many callbacks eventually call ui.displayWeatherData(), for diplaying that place on screen
  const _targetedPlaceDisplayOnScreen = (e) => {
    if (e.target.classList.contains('set-place')) {
      let arrayOfDivs = Array.from(storedPlacesDiv.children)
      let placeBox = e.target.closest('.stored-place-box')
      let placeIndex = arrayOfDivs.indexOf(placeBox)

      let storedPlaces = ls.getStoredPlaces()
      weather.getWeather(storedPlaces[placeIndex], false)
    }
  }

  document.addEventListener('click', _targetedPlaceDisplayOnScreen)

  return {
    displayPlaceInStoragePanel
  }
}


export const ls = new LocalStorage()
export const sp = new StoredPlaces()
