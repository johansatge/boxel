const fetch = require('node-fetch')
const credentials = require('../../.netatmo.json')
const { getMatrix, getMatrixFont, clearMatrixAndSync } = require('../../helpers/matrix.js')
const { getColorWhite } = require('../../helpers/colors.js')
const { log } = require('../../helpers/log.js')
const { isDryRun } = require('../../helpers/system.js')

const cachedAccessToken = {
  value: null,
  expireTimeSeconds: 0,
}
let cachedRefreshInterval = null

const m = {}
module.exports = m

m.getTitle = () => {
  return 'Netatmo weather'
}

m.getDescription = () => {
  return 'Weather information from a Netatmo station'
}

m.startMode = (rawData) => {
  getDataAndDraw()
  cachedRefreshInterval = setInterval(getDataAndDraw, 1000 * 60 * 2)
  return {}
}

m.applyModeAction = (action, rawData) => {
  // This mode doesn't accept actions
  return null
}

m.stopMode = () => {
  if (cachedRefreshInterval) {
    clearInterval(cachedRefreshInterval)
    cachedRefreshInterval = null
  }
  clearMatrixAndSync()
}

const getDataAndDraw = () => {
  getAccessToken()
  .then(getStationsData)
  .then((data) => {
    if (isDryRun()) {
      return
    }
    getMatrix().clear()
    getMatrix().fgColor(getColorWhite())
    getMatrix().font(getMatrixFont('4x6'))
    getMatrix().drawText('in', 1, 2)
    getMatrix().drawText('out', 1, 10)
    getMatrix().drawText('ppm', 1, 25)
    getMatrix().font(getMatrixFont('5x7'))
    getMatrix().drawText(`${Math.round(data.interiorTemp)}°`, 14, 1)
    getMatrix().drawText(`${Math.round(data.exteriorTemp)}°`, 14, 9)
    getMatrix().font(getMatrixFont('4x6'))
    getMatrix().drawText(`${Math.round(data.interiorCo2)}`, 14, 25)
    getMatrix().sync()
  })
  .catch((error) => {
    log(`Could not fetch Netatmo data (${error.message})`)
  })
}

const getStationsData = () => {
  const body = {
    access_token: cachedAccessToken.value,
  }
  return fetch('https://api.netatmo.net/api/getstationsdata', {
    method: 'post',
    body: Object.keys(body).map((param) => `${param}=${encodeURIComponent(body[param])}`).join('&'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.status !== 'ok' || !Array.isArray(json.body.devices) || json.body.devices.length === 0) {
        throw new Error('Netatmo response error')
      }
      const station = json.body.devices[0]
      const exteriorModule = station['modules'].length > 0 ? station['modules'][0] : null
      const stats = {
        interiorTemp: station['dashboard_data']['Temperature'],
        interiorHumidity: station['dashboard_data']['Humidity'],
        interiorCo2: station['dashboard_data']['CO2'],
        interiorNoise: station['dashboard_data']['Noise'],
        interiorPressure: station['dashboard_data']['Pressure'],
        exteriorTemp: exteriorModule ? exteriorModule['dashboard_data']['Temperature'] : -1,
        exteriorHumidity: exteriorModule ? exteriorModule['dashboard_data']['Humidity'] : -1,
      }
      log(`Fetched station data: ${JSON.stringify(stats, null, 2)}`)
      return stats
    })
}

const getAccessToken = () => {
  if (cachedAccessToken.expireTimeSeconds > nowSeconds()) {
    return Promise.resolve(cachedAccessToken.value)
  }
  const body = {
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    username: credentials.username,
    password: credentials.password,
    scope: 'read_station',
    grant_type: 'password',
  }
  return fetch('https://api.netatmo.net/oauth2/token', {
    method: 'post',
    body: Object.keys(body).map((param) => `${param}=${encodeURIComponent(body[param])}`).join('&'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      // Node the OAuth "refresh_token" mechanism isn't implemented (not worth it for now)
      // When the token expires after 3h, we regenerate one from scratch
      cachedAccessToken.value = json.access_token
      cachedAccessToken.expireTimeSeconds = nowSeconds() + json.expires_in
    })
}

const nowSeconds = () => {
  return Math.floor(new Date().getTime() / 1000)
}
