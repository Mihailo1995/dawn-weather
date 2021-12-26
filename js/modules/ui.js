/******************* UI *******************/
const UI = function() {
  const storage = document.querySelector('#storage-section')

  // Show the app, hide the loading screen
  const showApp = () => {
    document.querySelector('#app-loader').classList.add('display-none')
  }

  // Hide the app, show the loading screen
  const loadApp = () => {
    document.querySelector('#app-loader').classList.remove('display-none')
  }

  const showSections = () => {
    document.querySelector('#today-weather-section').classList.remove('display-none')
    document.querySelector('#lower-section').classList.remove('display-none')
  }
  const hideSections = () => {
    document.querySelector('#today-weather-section').classList.add('display-none')
    document.querySelector('#lower-section').classList.add('display-none')
  }

  // Storage button
  const _showStorage = () => (storage.style.right = 0)
  const _hideStorage = () => (storage.style.right = `-${Math.round(storage.offsetHeight / window.innerHeight * 100)}%`)
  document.querySelector('#open-storage-btn').onclick = _showStorage
  document.querySelector('#close-storage-btn').onclick = _hideStorage

  // Toggle daily/hourly weather
  const _toggleWeather = () => {
    const hourlyWeather = document.querySelector('#hourly-weather-div')
    const dailyWeather = document.querySelector('#daily-weather-div')
    const toggleBtn = document.querySelector('#toggle-weather-btn')
    const toggleIcon = document.querySelector('#toggle-weather-btn img')
    const active = toggleIcon.getAttribute('data-active')

    if (active === 'false') {
      toggleIcon.setAttribute('data-active', 'true')
      hourlyWeather.style.bottom = 0
      toggleIcon.setAttribute('src', 'resources/icons/7days.png')
      toggleIcon.setAttribute('alt', '7days icon')
      toggleBtn.setAttribute('title', 'Weather for the next 7 days')
      dailyWeather.style.opacity = 0
    } else if (active === 'true') {
      toggleIcon.setAttribute('data-active', 'false')
      hourlyWeather.style.bottom = `-${Math.round(hourlyWeather.offsetHeight / window.innerHeight * 100)}%`
      toggleIcon.setAttribute('src', 'resources/icons/24-hours.png')
      toggleIcon.setAttribute('alt', '24h icon7days icon')
      toggleBtn.setAttribute('title', 'Weather for the next 24h')
      dailyWeather.style.opacity = 1
    } else console.error('Invalid state of the data-active attribute')
  }

  // document.querySelector('#toggle-weather-btn').onclick = _toggleWeather
  document.querySelector('#toggle-weather-btn').addEventListener('click', _toggleWeather)

  /*------ Display weather data on screen ------*/
  const displayWeatherData = (data, location) => {
    const { icon, summary, temperature, humidity, windSpeed, pressure, cloudCover } = data.currently
    const dailyData = data.daily.data
    const hourlyData = data.hourly.data
    const daysOfWeek = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
    const dailyWeatherDiv = document.querySelector('#daily-weather-div')
    const hourlyWeatherDiv = document.querySelector('#hourly-weather-div')

    document.querySelector('#location-label').textContent = location.toLowerCase()
    document.querySelector('main').style.backgroundImage = `url('resources/img/weather-img/${icon}.jpg')`
    document.querySelector('#currently-weather-icon').setAttribute('src', `resources/icons/weather-icons/${icon}.png`)
    document.querySelector('#summary-label').textContent = summary
    document.querySelector('#temperature-label').innerHTML = Math.round((temperature - 32) * 5 / 9) + ' &#176;C'
    document.querySelector('#humidity-label').textContent = Math.round(humidity * 100) + '%'
    document.querySelector('#wind-speed-label').textContent = Math.round(windSpeed * 1.609) + ' km/h'
    document.querySelector('#pressure-label').textContent = Math.round(pressure) + ' hPa'
    document.querySelector('#cloud-cover-label').textContent = Math.round(cloudCover * 100) + '%'

    /***** Daily weather *****/
    // removes 8 days divs of previously displayed location
    while (dailyWeatherDiv.children[1]) dailyWeatherDiv.children[1].remove()

    for (let i = 0; i <= 7; i++) {
      // clone the node and remove class="display-none"
      let dailyWeatherClone = dailyWeatherDiv.children[0].cloneNode(true)
      dailyWeatherClone.classList.remove('display-none')
      let day = daysOfWeek[new Date(dailyData[i].time * 1000).getDay()]
      let dayMonth = new Date(dailyData[i].time * 1000).getDate() + '/' + (new Date(dailyData[i].time * 1000).getMonth() + 1)
      // set the name of the day h1
      dailyWeatherClone.children[0].children[0].textContent = day
      // set the day/month span
      dailyWeatherClone.children[0].children[1].textContent = dayMonth
      // set dailyIcon
      let dailyIcon = dailyData[i].icon
      dailyWeatherClone.children[1].children[0].setAttribute('src', `resources/icons/weather-icons/${dailyIcon}.png`)
      // set the max|min temperature
      let maxMinTemp = `<span  id="max-temp">${Math.round(
        (dailyData[i].temperatureMax - 32) * 5 / 9
      )}&#176;</span> | <span  id="min-temp">${Math.round((dailyData[i].temperatureMin - 32) * 5 / 9)}&#176;</span>`
      dailyWeatherClone.children[2].innerHTML = maxMinTemp
      // append the dailyWeatherClone
      dailyWeatherDiv.appendChild(dailyWeatherClone)
    }

    /***** Hourly weather *****/
    // removes 24 h divs of previously displayed location
    while (hourlyWeatherDiv.children[1]) hourlyWeatherDiv.children[1].remove()

    for (let i = 0; i <= 24; i++) {
      // clone the node and remove class="display-none"
      let hourlyWeatherClone = hourlyWeatherDiv.children[0].cloneNode(true)
      hourlyWeatherClone.classList.remove('display-none')
      // set hour
      let hour = new Date(hourlyData[i].time * 1000).getHours()
      hourlyWeatherClone.children[0].children[0].textContent = (hour < 10 ? '0' : '') + hour + ':00'
      // set hourlyIcon
      let hourlyIcon = hourlyData[i].icon
      hourlyWeatherClone.children[1].children[0].setAttribute('src', `resources/icons/weather-icons/${hourlyIcon}.png`)
      // set temperature by hour
      hourlyWeatherClone.children[2].children[0].innerHTML =
        Math.round((hourlyData[i].temperature - 32) * 5 / 9) + '&#176;'
      // append the hourlyWeatherClone
      hourlyWeatherDiv.appendChild(hourlyWeatherClone)
    }

    ui.showSections()
    ui.showApp()
  }

  return {
    showApp,
    loadApp,
    showSections,
    hideSections,
    displayWeatherData
  }
}

export const ui = new UI()
