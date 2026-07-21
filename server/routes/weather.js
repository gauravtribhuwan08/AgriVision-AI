const express = require('express');
const router = express.Router();
const { getWeather } = require('../services/weatherService');

// GET /api/weather/:lat/:lon
router.get('/:lat/:lon', async (req, res) => {
  try {
    const lat = parseFloat(req.params.lat);
    const lon = parseFloat(req.params.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates' });
    }

    const weatherData = await getWeather(lat, lon);
    res.json({ success: true, data: weatherData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
