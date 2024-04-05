const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  });

const District = mongoose.model('District', districtSchema);

module.exports = District;
