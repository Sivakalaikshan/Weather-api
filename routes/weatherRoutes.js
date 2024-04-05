const express = require('express');
const District = require('../models/districtModel');
const WeatherData = require('../models/weatherDataModel');
const router = express.Router();
const cron = require('node-cron');
const moment = require('moment');


const axios = require('axios');

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/districts');
    const data = response.data;
    console.log('Data fetched:', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};



fetchData();


const intervalId = cron.schedule('*/1 * * * *', async () => {
  try {
    await fetchData();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});


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


router.get('/districts', async (req, res) => {
  try {
    const districtDetails = await fetchDistrictDetailsWithWeatherData();
    res.json(districtDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
