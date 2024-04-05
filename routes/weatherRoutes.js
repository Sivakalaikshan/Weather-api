const express = require('express');
const District = require('../models/districtModel');
const WeatherData = require('../models/weatherDataModel');
const router = express.Router();
const cron = require('node-cron');


const fetchDistrictDetailsWithWeatherData = async () => {
  try {
    const districts = await District.find();
    const districtDetails = await Promise.all(districts.map(async district => {
      const latestWeatherData = await WeatherData.find({ district: district._id }, {}, { sort: { timestamp: -1 } });
      return {
        name: district.name,
        latitude: district.latitude,
        longitude: district.longitude,
        temperature: latestWeatherData.length > 0 ? latestWeatherData[0].temperature : null,
        humidity: latestWeatherData.length > 0 ? latestWeatherData[0].humidity : null,
        airPressure: latestWeatherData.length > 0 ? latestWeatherData[0].airPressure : null,
      };
    }));
    return districtDetails;
  } catch (error) {
    throw error;
  }
};

const intervalId = cron.schedule('*/3 * * * * *', async () => {
  try {
    await fetchDistrictDetailsWithWeatherData();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});


router.get('/districts', async (req, res) => {
  try {
    const districtDetails = await fetchDistrictDetailsWithWeatherData();
    res.json(districtDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
