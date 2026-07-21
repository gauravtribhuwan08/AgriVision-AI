// ============================================================
// Soil Prediction Engine — Simulated Satellite + Weather AI
// Predicts NPK levels, pH, moisture using location data
// Generates color-coded map grid and fertilizer schedule
// ============================================================

const SOIL_TYPES_BY_LAT = {
  // India-specific soil zones (approximate)
  alluvial: { lat: [20, 30], lon: [73, 88] },
  black: { lat: [17, 25], lon: [73, 80] },
  red: { lat: [10, 20], lon: [76, 86] },
  laterite: { lat: [8, 15], lon: [74, 80] }
};

const FERTILIZER_PRODUCTS = {
  nitrogen: [
    { name: 'Vermicompost', organic: true, npk: '1.5-0.5-0.7' },
    { name: 'Farm Yard Manure (FYM)', organic: true, npk: '0.5-0.2-0.5' },
    { name: 'Urea (46% N)', organic: false, npk: '46-0-0' },
    { name: 'Neem-coated Urea', organic: true, npk: '46-0-0' }
  ],
  phosphorus: [
    { name: 'Rock Phosphate', organic: true, npk: '0-20-0' },
    { name: 'Bone Meal', organic: true, npk: '3-15-0' },
    { name: 'Single Super Phosphate', organic: false, npk: '0-16-0' }
  ],
  potassium: [
    { name: 'Wood Ash', organic: true, npk: '0-1-3' },
    { name: 'Compost', organic: true, npk: '0.5-0.3-0.5' },
    { name: 'Muriate of Potash (MOP)', organic: false, npk: '0-0-60' }
  ],
  balanced: [
    { name: 'NPK 19-19-19', organic: false, npk: '19-19-19' },
    { name: 'Biofertilizer Mix', organic: true, npk: '2-2-2' }
  ]
};

/**
 * Seeded pseudo-random number generator (PRNG)
 * Ensures consistent results for the same lat/lon
 */
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Clamp a value between min and max
 */
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Get soil type based on lat/lon
 */
function getSoilType(lat, lon) {
  const types = ['Alluvial', 'Black', 'Red', 'Laterite', 'Loamy', 'Sandy', 'Clay'];
  const seed = Math.abs(Math.floor((lat * 13 + lon * 7) % types.length));
  return types[Math.abs(seed)];
}

/**
 * Predict soil nutrients for a given location
 */
function predictSoilNutrients(lat, lon, soilType) {
  const seed = Math.abs(Math.floor(lat * 1000 + lon * 100));
  const rng = seededRandom(seed);

  // Base nutrient ranges (mg/kg) for Indian agriculture context
  const baseN = 150 + rng() * 200; // 150–350 kg/ha
  const baseP = 10 + rng() * 40;   // 10–50 kg/ha
  const baseK = 100 + rng() * 200; // 100–300 kg/ha
  const basePH = 5.5 + rng() * 2.5; // 5.5–8.0
  const baseOC = 0.3 + rng() * 1.2; // 0.3–1.5%
  const baseMoisture = 20 + rng() * 50; // 20–70%
  const zinc = 0.4 + rng() * 1.6;
  const iron = 4 + rng() * 10;
  const sulphur = 5 + rng() * 20;

  return {
    nitrogen: parseFloat(baseN.toFixed(1)),
    phosphorus: parseFloat(baseP.toFixed(1)),
    potassium: parseFloat(baseK.toFixed(1)),
    ph: parseFloat(basePH.toFixed(1)),
    organicCarbon: parseFloat(baseOC.toFixed(2)),
    moisture: parseFloat(baseMoisture.toFixed(1)),
    zinc: parseFloat(zinc.toFixed(2)),
    iron: parseFloat(iron.toFixed(1)),
    sulphur: parseFloat(sulphur.toFixed(1))
  };
}

/**
 * Calculate overall soil health score (0–100)
 */
function calculateHealthScore(nutrients) {
  let score = 100;

  // Nitrogen: ideal 200–280 kg/ha
  if (nutrients.nitrogen < 150) score -= 20;
  else if (nutrients.nitrogen < 200) score -= 10;
  else if (nutrients.nitrogen > 350) score -= 5;

  // Phosphorus: ideal 20–40 kg/ha
  if (nutrients.phosphorus < 10) score -= 20;
  else if (nutrients.phosphorus < 20) score -= 10;

  // Potassium: ideal 150–250 kg/ha
  if (nutrients.potassium < 100) score -= 15;
  else if (nutrients.potassium < 150) score -= 8;

  // pH: ideal 6.0–7.5
  if (nutrients.ph < 5.5 || nutrients.ph > 8.5) score -= 20;
  else if (nutrients.ph < 6.0 || nutrients.ph > 7.5) score -= 10;

  // Organic Carbon: ideal > 0.75%
  if (nutrients.organicCarbon < 0.3) score -= 15;
  else if (nutrients.organicCarbon < 0.75) score -= 7;

  return clamp(score, 10, 100);
}

/**
 * Generate NDVI index based on location and season
 */
function getNDVI(lat, lon) {
  const seed = Math.abs(Math.floor(lat * 71 + lon * 37));
  const rng = seededRandom(seed + 1);
  return parseFloat((0.3 + rng() * 0.5).toFixed(2)); // 0.3–0.8
}

/**
 * Generate fertilizer schedule based on soil deficiencies
 */
function generateFertilizerSchedule(nutrients, weatherData) {
  const schedule = [];
  const isRainy = weatherData && weatherData.rainfall > 5;

  // Week 1–2: Soil preparation
  schedule.push({
    week: 1,
    fertilizer: 'Farm Yard Manure (FYM)',
    quantity: '5–8 tonnes/ha',
    method: 'Broadcast and incorporate into soil',
    nutrientTarget: 'Organic Matter & Micronutrients',
    notes: 'Apply before sowing/transplanting. Mix into top 15cm of soil.'
  });

  // Week 3–4: Nitrogen boost if deficient
  if (nutrients.nitrogen < 200) {
    schedule.push({
      week: 3,
      fertilizer: 'Neem-coated Urea',
      quantity: '25–40 kg N/ha',
      method: 'Band placement near root zone',
      nutrientTarget: 'Nitrogen (N)',
      notes: 'Slow-release coated urea reduces volatilization losses by 30%.'
    });
  }

  // Week 4–5: Phosphorus if deficient
  if (nutrients.phosphorus < 20) {
    schedule.push({
      week: 4,
      fertilizer: 'Rock Phosphate',
      quantity: '100–150 kg/ha',
      method: 'Basal incorporation before planting',
      nutrientTarget: 'Phosphorus (P)',
      notes: 'Best in acidic soils. Combine with organic matter for better solubility.'
    });
  }

  // Week 5: Potassium if deficient
  if (nutrients.potassium < 150) {
    schedule.push({
      week: 5,
      fertilizer: 'Wood Ash / Muriate of Potash',
      quantity: '40–60 kg K2O/ha',
      method: isRainy ? 'Foliar spray (2%)' : 'Soil broadcast',
      nutrientTarget: 'Potassium (K)',
      notes: `Wood ash (organic) improves pH and potassium simultaneously. ${isRainy ? 'Foliar application avoids leaching.' : ''}`
    });
  }

  // Week 6: Micronutrients
  if (nutrients.zinc < 0.6) {
    schedule.push({
      week: 6,
      fertilizer: 'Zinc Sulphate',
      quantity: '25 kg/ha',
      method: 'Soil application or 0.5% foliar spray',
      nutrientTarget: 'Zinc (Zn)',
      notes: 'Zinc deficiency is common in alkaline soils. Apply during early vegetative stage.'
    });
  }

  // Week 8: Mid-season top dressing
  schedule.push({
    week: 8,
    fertilizer: 'Vermicompost',
    quantity: '2–3 tonnes/ha',
    method: 'Side dressing around plant base',
    nutrientTarget: 'Nitrogen + Organic Matter',
    notes: 'Improves soil structure and provides slow-release nutrients for mid-season growth.'
  });

  // Week 10: pH correction if needed
  if (nutrients.ph < 6.0) {
    schedule.push({
      week: 10,
      fertilizer: 'Agricultural Lime (Calcitic)',
      quantity: '1–2 tonnes/ha',
      method: 'Broadcast and till into topsoil',
      nutrientTarget: 'pH Correction',
      notes: 'Raises soil pH. Apply 2–3 months before next planting for best results.'
    });
  } else if (nutrients.ph > 7.5) {
    schedule.push({
      week: 10,
      fertilizer: 'Elemental Sulphur',
      quantity: '200–500 kg/ha',
      method: 'Incorporate into soil',
      nutrientTarget: 'pH Reduction',
      notes: 'Lowers alkaline soil pH gradually. Use gypsum (CaSO4) as a faster alternative.'
    });
  }

  // Week 12: Pre-harvest foliar boost
  schedule.push({
    week: 12,
    fertilizer: 'Seaweed Extract + NPK Foliar Spray',
    quantity: '2–3 mL/L water',
    method: 'Foliar spray on canopy',
    nutrientTarget: 'Micronutrients + Growth Regulators',
    notes: 'Improves fruit quality, size, and shelf life. Apply in early morning or evening.'
  });

  return schedule;
}

/**
 * Generate grid map data for Leaflet heatmap overlay
 * Creates a 7x7 grid of nutrient values around the location
 */
function generateMapGrid(lat, lon, nutrients) {
  const gridPoints = [];
  const size = 0.05; // ~5km grid
  const steps = 7;

  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      const pointLat = lat - (size * 3) + (i * size);
      const pointLon = lon - (size * 3) + (j * size);
      const seed = Math.abs(Math.floor(pointLat * 1000 + pointLon * 100));
      const rng = seededRandom(seed + 99);

      // Spatial variation around the center point
      const variation = 0.85 + rng() * 0.3;
      gridPoints.push({
        lat: parseFloat(pointLat.toFixed(4)),
        lon: parseFloat(pointLon.toFixed(4)),
        nitrogen: parseFloat((nutrients.nitrogen * variation).toFixed(1)),
        phosphorus: parseFloat((nutrients.phosphorus * variation).toFixed(1)),
        potassium: parseFloat((nutrients.potassium * variation).toFixed(1)),
        healthScore: clamp(Math.floor(50 + rng() * 50), 20, 100)
      });
    }
  }

  return {
    bounds: {
      north: lat + size * 3.5,
      south: lat - size * 3.5,
      east: lon + size * 3.5,
      west: lon - size * 3.5
    },
    gridPoints
  };
}

/**
 * Main prediction function
 */
function predictSoil(lat, lon, providedSoilType, weatherData) {
  const soilType = providedSoilType || getSoilType(lat, lon);
  const nutrients = predictSoilNutrients(lat, lon, soilType);
  const healthScore = calculateHealthScore(nutrients);
  const ndviIndex = getNDVI(lat, lon);
  const fertilizerSchedule = generateFertilizerSchedule(nutrients, weatherData);
  const mapData = generateMapGrid(lat, lon, nutrients);

  return {
    soilType,
    nutrients,
    soilHealthScore: healthScore,
    ndviIndex,
    fertilizerSchedule,
    mapData
  };
}

module.exports = { predictSoil };
