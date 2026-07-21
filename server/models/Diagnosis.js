const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  imagePath: { type: String, required: true },
  originalFilename: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropType: { type: String, required: true },
  diseaseName: { type: String, required: true },
  pathogenType: {
    type: String,
    enum: ['Fungal', 'Bacterial', 'Viral', 'Pest', 'Insect', 'Nutrient Deficiency', 'Healthy', 'Unknown'],
    required: true
  },
  confidence: { type: Number, required: true, min: 0, max: 100 },
  severity: {
    type: String,
    enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  organicTreatments: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    frequency: { type: String, required: true },
    ingredients: [String]
  }],
  preventionTips: [String],
  affectedArea: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diagnosis', diagnosisSchema);
