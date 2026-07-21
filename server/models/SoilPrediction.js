const mongoose = require('mongoose');

const soilPredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    name: { type: String, default: 'Unknown Location' }
  },
  soilType: {
    type: String,
    enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain', 'Clay', 'Sandy', 'Loamy'],
    default: 'Loamy'
  },
  nutrients: {
    nitrogen: { type: Number, required: true },
    phosphorus: { type: Number, required: true },
    potassium: { type: Number, required: true },
    ph: { type: Number, required: true },
    organicCarbon: { type: Number, required: true },
    moisture: { type: Number, required: true },
    zinc: { type: Number },
    iron: { type: Number },
    sulphur: { type: Number }
  },
  soilHealthScore: { type: Number, required: true, min: 0, max: 100 },
  ndviIndex: { type: Number },
  weatherData: {
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    windSpeed: Number,
    description: String,
    icon: String
  },
  fertilizerSchedule: [{
    week: Number,
    fertilizer: String,
    quantity: String,
    method: String,
    nutrientTarget: String,
    notes: String
  }],
  mapData: {
    bounds: {
      north: Number,
      south: Number,
      east: Number,
      west: Number
    },
    gridPoints: [{
      lat: Number,
      lon: Number,
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      healthScore: Number
    }]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SoilPrediction', soilPredictionSchema);
