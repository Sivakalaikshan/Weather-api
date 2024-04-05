const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
  },
  temperature: Number,
  humidity: Number,
  airPressure: Number,
  timestamp: { type: Date, default: Date.now },
});

const WeatherData = mongoose.model('WeatherData', weatherSchema);

module.exports = WeatherData;
