const netatmo = require('netatmo')

const auth = {
  client_id     : process.env.NETATMO_CLIENT_ID,
  client_secret : process.env.NETATMO_CLIENT_SECRET,
  username      : process.env.NETATMO_USERNAME,
  password      : process.env.NETATMO_PASSWORD,
};

const getStats = () => {
  return new Promise((resolve, reject) => {
    const api = new netatmo(auth);
    api.getStationsData((error, devices) => {
      if (error) {
        return reject(error)
      }
      if (!devices[0] || !devices[0]['modules'] || !devices[0]['modules'][0]) {
        return reject(new Error('Unable to extract data from API response'))
      }
      const station = devices[0]
      resolve({
        interiorTemp     : station['dashboard_data']['Temperature'],
        interiorHumidity : station['dashboard_data']['Humidity'],
        interiorCO2      : station['dashboard_data']['CO2'],
        exteriorTemp     : station['modules'][0]['dashboard_data']['Temperature'],
        exteriorHumidity : station['modules'][0]['dashboard_data']['Humidity'],
      })
    })
  })
}

module.exports = {
  getStats : getStats,
}
