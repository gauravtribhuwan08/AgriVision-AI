const express = require('express');
const router = express.Router();
const path = require('path');
const upload = require('../middleware/upload');
const { analyzeImage } = require('../services/diseaseEngine');
const Diagnosis = require('../models/Diagnosis');
const auth = require('../middleware/auth');

// POST /api/diagnose — Upload image and get diagnosis
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const { filename, originalname, mimetype, path: filePath } = req.file;

    // Run real Gemini Vision AI analysis on the uploaded image (falls back to deterministic simulation on quota limits)
    const analysis = await analyzeImage(filePath, mimetype, originalname);

    const diagnosisData = {
      imagePath: `/uploads/${filename}`,
      originalFilename: originalname,
      userId: req.userId,
      ...analysis
    };

    // Try to save to MongoDB (gracefully skip if DB not connected)
    let savedDiagnosis = null;
    try {
      const diagnosis = new Diagnosis(diagnosisData);
      savedDiagnosis = await diagnosis.save();
    } catch (dbErr) {
      console.log('DB save skipped:', dbErr.message);
    }

    res.status(200).json({
      success: true,
      data: {
        id: savedDiagnosis?._id || `temp_${Date.now()}`,
        ...diagnosisData,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Diagnosis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/diagnose/history — Get all diagnoses
router.get('/history', auth, async (req, res) => {
  try {
    const diagnoses = await Diagnosis.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: diagnoses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/diagnose/:id — Get specific diagnosis
router.get('/:id', auth, async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findOne({ _id: req.params.id, userId: req.userId });
    if (!diagnosis) return res.status(404).json({ success: false, message: 'Diagnosis not found' });
    res.json({ success: true, data: diagnosis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
