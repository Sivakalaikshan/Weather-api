const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const cron = require('node-cron');
const userRoutes = require('./routes/userRoutes');
const districtRoutes = require('./routes/districtRoutes');
const weatherDataRoutes = require('./routes/weatherRoutes');
const District = require('./models/districtModel');
const WeatherData = require('./models/weatherDataModel');

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://root:root@atlascluster.kedmcse.mongodb.net/weatherApp?retryWrites=true&w=majority&appName=AtlasCluster').then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
  process.exit(1);
});


app.use(cors());


app.use('/user', userRoutes);


app.use('/api', districtRoutes);


app.use('/api', weatherDataRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  
  try {
    await insertDistricts();
    await insertWeatherData();
    console.log('Districts inserted successfully');
  } catch (error) {
    console.error('Error inserting districts:', error.message);
  }

  
  cron.schedule('*/5 * * * *', async () => {
    try {
      await insertWeatherData();
      console.log('Weather data inserted successfully');
    } catch (error) {
      console.error('Error inserting weather data:', error.message);
    }
  });
});


const insertDistricts = async () => {
  const districts = [
    { name: 'Colombo', latitude: 6.9271, longitude: 79.8612 },
  { name: 'Gampaha', latitude: 7.0873, longitude: 80.0144 },
  { name: 'Polanaruwa', latitude: 7.9403, longitude: 81.0188 },
  { name: 'Puthalam', latitude: 8.0341, longitude: 79.8437 },
  { name: 'Anuradhapura', latitude: 8.3114, longitude: 80.4037 },
  { name: 'Badulla', latitude: 6.9934, longitude: 81.0556 },
  { name: 'Batticaloa', latitude: 7.7176, longitude: 81.7006 },
  { name: 'Galle', latitude: 6.0535, longitude: 80.2202 },
  { name: 'Hambantota', latitude: 6.1241, longitude: 81.1187 },
  { name: 'Jaffna', latitude: 9.6612, longitude: 80.0255 },
  { name: 'Kalmunai', latitude: 7.4144, longitude: 81.8197 },
  { name: 'Kalutara', latitude: 6.5854, longitude: 79.9607 },
  { name: 'Kandy', latitude: 7.2906, longitude: 80.6337 },
  { name: 'Kegalle', latitude: 7.2514, longitude: 80.3464 },
  { name: 'Kilinochchi', latitude: 9.3986, longitude: 80.4037 },
  { name: 'Kurunegala', latitude: 7.4801, longitude: 80.3543 },
  { name: 'Mannar', latitude: 8.9776, longitude: 79.9094 },
  { name: 'Matara', latitude: 5.9545, longitude: 80.555 },
  { name: 'Moneragala', latitude: 6.8758, longitude: 81.349 },
  { name: 'Mullaitivu', latitude: 9.2677, longitude: 80.7892 },
  { name: 'Nuwara Eliya', latitude: 6.9497, longitude: 80.7892 },
  { name: 'Ratnapura', latitude: 6.7058, longitude: 80.3841 },
  { name: 'Trincomalee', latitude: 8.5877, longitude: 81.2152 },
  { name: 'Vavuniya', latitude: 8.7547, longitude: 80.4985 },
  { name: 'Matale', latitude: 7.4675, longitude: 80.6234 }
    
  ];

  await District.insertMany(districts);
};


const insertWeatherData = async () => {
  const districts = await District.find();


  const weatherData = districts.map(district => ({
    district: district._id,
    temperature: parseFloat((Math.random() * 30 + 20).toFixed(1)),
    humidity: parseFloat((Math.random() * 50 + 50).toFixed(1)),
    airPressure: parseFloat((Math.random() * 100 + 900).toFixed(1)),
  }));


  await WeatherData.insertMany(weatherData);
};
