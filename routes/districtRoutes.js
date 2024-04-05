const express = require('express');
const router = express.Router();
const District = require('../models/districtModel');


router.post('/', async (req, res) => {
  try {
    const district = new District(req.body);
    await district.save();
    res.status(201).send(district);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.get('/', async (req, res) => {
  try {
    const districts = await District.find();
    res.send(districts);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
