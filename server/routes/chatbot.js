const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Diagnosis = require('../models/Diagnosis');
const SoilPrediction = require('../models/SoilPrediction');
const { generateResponse } = require('../services/chatbotService');

// POST /api/chatbot — Interact with AgriBot
router.post('/', auth, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Fetch user's recent context (top 3 leaf scans and top 3 soil predictions)
    let diagnoses = [];
    let soilPredictions = [];
    try {
      diagnoses = await Diagnosis.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .limit(3);
      
      soilPredictions = await SoilPrediction.find({ userId: req.userId })
        .select('-mapData.gridPoints') // Exclude map coordinates to keep the payload clean
        .sort({ createdAt: -1 })
        .limit(3);
    } catch (dbErr) {
      console.warn('⚠️ Could not load history context for AgriBot:', dbErr.message);
    }

    // Pass user history + active chat session messages to the Gemini engine
    const reply = await generateResponse(message, history || [], { diagnoses, soilPredictions });

    res.status(200).json({
      success: true,
      data: reply
    });
  } catch (error) {
    console.error('❌ Chatbot route error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
