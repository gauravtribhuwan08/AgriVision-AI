const express = require('express');
const router = express.Router();
const { predictSoil } = require('../services/soilEngine');
const { getWeather } = require('../services/weatherService');
const SoilPrediction = require('../models/SoilPrediction');
const auth = require('../middleware/auth');

// POST /api/soil/predict — Predict soil nutrients for a location
router.post('/predict', auth, async (req, res) => {
  try {
    const { lat, lon, locationName, soilType } = req.body;

    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates' });
    }

    // Get weather data (real or simulated)
    const weatherData = await getWeather(latitude, longitude);

    // Run soil prediction
    const soilResult = predictSoil(latitude, longitude, soilType, weatherData);

    const predictionData = {
      location: {
        lat: latitude,
        lon: longitude,
        name: locationName || `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`
      },
      userId: req.userId,
      soilType: soilResult.soilType,
      nutrients: soilResult.nutrients,
      soilHealthScore: soilResult.soilHealthScore,
      ndviIndex: soilResult.ndviIndex,
      weatherData,
      fertilizerSchedule: soilResult.fertilizerSchedule,
      mapData: soilResult.mapData
    };

    // Try to save to MongoDB
    let savedPrediction = null;
    try {
      const prediction = new SoilPrediction(predictionData);
      savedPrediction = await prediction.save();
    } catch (dbErr) {
      console.log('DB save skipped:', dbErr.message);
    }

    res.status(200).json({
      success: true,
      data: {
        id: savedPrediction?._id || `temp_${Date.now()}`,
        ...predictionData,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Soil prediction error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/soil/history — Get all soil predictions
router.get('/history', auth, async (req, res) => {
  try {
    const predictions = await SoilPrediction.find({ userId: req.userId })
      .select('-mapData.gridPoints')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, data: predictions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/soil/:id — Get specific prediction
router.get('/:id', auth, async (req, res) => {
  try {
    const prediction = await SoilPrediction.findOne({ _id: req.params.id, userId: req.userId });
    if (!prediction) return res.status(404).json({ success: false, message: 'Prediction not found' });
    res.json({ success: true, data: prediction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
