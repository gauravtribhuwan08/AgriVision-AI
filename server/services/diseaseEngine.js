// ============================================================
// Disease Detection Engine — Simulated Computer Vision AI
// Mimics a CNN model trained on PlantVillage dataset (38 classes)
// Returns realistic disease diagnosis + organic treatment plan
// ============================================================

const DISEASE_DATABASE = {
  // TOMATO DISEASES
  'tomato_early_blight': {
    cropType: 'Tomato',
    diseaseName: 'Early Blight',
    pathogenType: 'Fungal',
    scientificName: 'Alternaria solani',
    severity: 'Medium',
    affectedArea: 35,
    organicTreatments: [
      {
        name: 'Neem Oil Spray',
        description: 'Mix 2 tbsp neem oil with 1 tsp dish soap in 1 litre water. Spray on all leaf surfaces.',
        frequency: 'Every 7 days',
        ingredients: ['Neem oil', 'Dish soap', 'Water']
      },
      {
        name: 'Copper-Based Fungicide',
        description: 'Apply Bordeaux mixture (copper sulphate + lime) to control fungal spread.',
        frequency: 'Every 10 days',
        ingredients: ['Copper sulphate', 'Lime', 'Water']
      },
      {
        name: 'Baking Soda Solution',
        description: 'Mix 1 tbsp baking soda + 1 tsp liquid soap in 1 litre water. Spray infected areas.',
        frequency: 'Every 5–7 days',
        ingredients: ['Baking soda', 'Liquid soap', 'Water']
      }
    ],
    preventionTips: [
      'Avoid overhead watering; use drip irrigation',
      'Remove and destroy infected plant debris',
      'Maintain proper spacing for air circulation',
      'Rotate crops every season',
      'Apply mulch to prevent soil splash'
    ]
  },
  'tomato_late_blight': {
    cropType: 'Tomato',
    diseaseName: 'Late Blight',
    pathogenType: 'Fungal',
    scientificName: 'Phytophthora infestans',
    severity: 'High',
    affectedArea: 55,
    organicTreatments: [
      {
        name: 'Copper Hydroxide Spray',
        description: 'Apply copper hydroxide fungicide (Kocide) at first sign of disease. Coat all leaf surfaces.',
        frequency: 'Every 5–7 days during wet weather',
        ingredients: ['Copper hydroxide', 'Water']
      },
      {
        name: 'Trichoderma Application',
        description: 'Drench soil with Trichoderma viride or T. harzianum bio-fungicide solution.',
        frequency: 'Bi-weekly soil drench',
        ingredients: ['Trichoderma viride', 'Water']
      },
      {
        name: 'Garlic Extract Spray',
        description: 'Blend 10 garlic cloves in 1 litre water. Strain and spray undiluted on leaves.',
        frequency: 'Every 3–4 days',
        ingredients: ['Garlic', 'Water']
      }
    ],
    preventionTips: [
      'Plant resistant varieties like Mountain Magic or Defiant',
      'Ensure excellent drainage in the field',
      'Scout plants regularly for dark water-soaked lesions',
      'Avoid planting near potato fields',
      'Remove all infected material immediately'
    ]
  },
  'tomato_leaf_mold': {
    cropType: 'Tomato',
    diseaseName: 'Leaf Mold',
    pathogenType: 'Fungal',
    scientificName: 'Passalora fulva',
    severity: 'Medium',
    affectedArea: 30,
    organicTreatments: [
      {
        name: 'Potassium Bicarbonate',
        description: 'Mix 1 tbsp potassium bicarbonate per litre water. Spray on affected leaves.',
        frequency: 'Every 7 days',
        ingredients: ['Potassium bicarbonate', 'Water', 'Wetting agent']
      },
      {
        name: 'Neem Cake Drench',
        description: 'Apply neem cake extract to soil to reduce fungal load.',
        frequency: 'Monthly soil treatment',
        ingredients: ['Neem cake', 'Water']
      }
    ],
    preventionTips: [
      'Increase ventilation in greenhouses',
      'Keep humidity below 85%',
      'Water in the morning so foliage dries before night',
      'Prune lower leaves for better airflow'
    ]
  },
  'tomato_bacterial_spot': {
    cropType: 'Tomato',
    diseaseName: 'Bacterial Spot',
    pathogenType: 'Bacterial',
    scientificName: 'Xanthomonas vesicatoria',
    severity: 'High',
    affectedArea: 45,
    organicTreatments: [
      {
        name: 'Copper-Based Bactericide',
        description: 'Apply copper octanoate spray. Begin at first symptom and repeat regularly.',
        frequency: 'Every 7–10 days',
        ingredients: ['Copper octanoate', 'Water']
      },
      {
        name: 'Hydrogen Peroxide Spray',
        description: 'Dilute food-grade H2O2 (3%) to 0.5% with water. Spray as a bactericide.',
        frequency: 'Every 5 days',
        ingredients: ['Hydrogen peroxide (3%)', 'Water']
      }
    ],
    preventionTips: [
      'Use certified disease-free seeds',
      'Avoid working with plants when wet',
      'Disinfect tools between plants',
      'Eliminate weed hosts',
      'Use drip irrigation to reduce leaf wetness'
    ]
  },
  'tomato_healthy': {
    cropType: 'Tomato',
    diseaseName: 'No Disease Detected',
    pathogenType: 'Healthy',
    scientificName: null,
    severity: 'None',
    affectedArea: 0,
    organicTreatments: [],
    preventionTips: [
      'Continue regular monitoring every 7 days',
      'Maintain proper irrigation schedule',
      'Apply compost to maintain soil health',
      'Ensure adequate spacing and sunlight'
    ]
  },
  // POTATO DISEASES
  'potato_early_blight': {
    cropType: 'Potato',
    diseaseName: 'Early Blight',
    pathogenType: 'Fungal',
    scientificName: 'Alternaria solani',
    severity: 'Medium',
    affectedArea: 28,
    organicTreatments: [
      {
        name: 'Neem Oil + Copper Spray',
        description: 'Combine neem oil with copper sulphate for dual-action fungal control.',
        frequency: 'Every 7–10 days',
        ingredients: ['Neem oil', 'Copper sulphate', 'Water', 'Dish soap']
      },
      {
        name: 'Compost Tea Spray',
        description: 'Brew 500g compost in 5L water for 24 hours. Strain and spray on foliage.',
        frequency: 'Weekly',
        ingredients: ['Finished compost', 'Water', 'Molasses']
      }
    ],
    preventionTips: [
      'Hilling potatoes reduces soil splash onto leaves',
      'Remove infected leaves promptly',
      'Plant certified disease-free seed potatoes',
      'Practice 3–4 year crop rotation'
    ]
  },
  'potato_late_blight': {
    cropType: 'Potato',
    diseaseName: 'Late Blight',
    pathogenType: 'Fungal',
    scientificName: 'Phytophthora infestans',
    severity: 'Critical',
    affectedArea: 70,
    organicTreatments: [
      {
        name: 'Bordeaux Mixture',
        description: 'Mix 100g copper sulphate + 100g lime in 10L water. Apply preventively.',
        frequency: 'Every 5–7 days in humid conditions',
        ingredients: ['Copper sulphate', 'Hydrated lime', 'Water']
      },
      {
        name: 'Copper Oxychloride',
        description: 'Apply copper oxychloride fungicide as protective coating on foliage.',
        frequency: 'Every 7 days',
        ingredients: ['Copper oxychloride', 'Water']
      }
    ],
    preventionTips: [
      'Monitor weather forecasts; spray before rain',
      'Plant in well-drained fields',
      'Destroy volunteer potato plants',
      'Harvest promptly when tops die down'
    ]
  },
  // CORN DISEASES
  'corn_common_rust': {
    cropType: 'Corn',
    diseaseName: 'Common Rust',
    pathogenType: 'Fungal',
    scientificName: 'Puccinia sorghi',
    severity: 'Medium',
    affectedArea: 40,
    organicTreatments: [
      {
        name: 'Sulphur-Based Fungicide',
        description: 'Apply wettable sulphur spray to control rust pustules.',
        frequency: 'Every 10–14 days',
        ingredients: ['Wettable sulphur', 'Water']
      },
      {
        name: 'Biofungicide (Bacillus subtilis)',
        description: 'Apply Serenade (B. subtilis) biofungicide as a preventive and curative treatment.',
        frequency: 'Every 7 days',
        ingredients: ['Bacillus subtilis culture', 'Water']
      }
    ],
    preventionTips: [
      'Plant rust-resistant hybrids',
      'Ensure early planting to avoid high-rust pressure seasons',
      'Scout fields regularly from V6 stage onwards'
    ]
  },
  'corn_northern_leaf_blight': {
    cropType: 'Corn',
    diseaseName: 'Northern Leaf Blight',
    pathogenType: 'Fungal',
    scientificName: 'Exserohilum turcicum',
    severity: 'High',
    affectedArea: 50,
    organicTreatments: [
      {
        name: 'Neem Seed Kernel Extract',
        description: 'Apply 5% NSKE (neem seed kernel extract) spray on canopy.',
        frequency: 'Every 7–10 days',
        ingredients: ['Neem seeds', 'Water', 'Soap emulsifier']
      },
      {
        name: 'Trichoderma Foliar Spray',
        description: 'Spray Trichoderma viride @ 5g/L water on foliage.',
        frequency: 'Every 10 days',
        ingredients: ['Trichoderma viride powder', 'Water']
      }
    ],
    preventionTips: [
      'Choose resistant hybrid varieties',
      'Apply nitrogen at recommended rates',
      'Crop rotation with non-grass crops',
      'Bury or remove crop residues after harvest'
    ]
  },
  // RICE DISEASES
  'rice_blast': {
    cropType: 'Rice',
    diseaseName: 'Rice Blast',
    pathogenType: 'Fungal',
    scientificName: 'Magnaporthe oryzae',
    severity: 'Critical',
    affectedArea: 65,
    organicTreatments: [
      {
        name: 'Silicon Soil Amendment',
        description: 'Apply silicate slag or rice husk ash to increase plant silicon content and resistance.',
        frequency: 'Basal application before planting',
        ingredients: ['Silicate slag / Rice husk ash']
      },
      {
        name: 'Pseudomonas fluorescens Spray',
        description: 'Mix P. fluorescens (10^8 CFU/mL) and spray on foliage.',
        frequency: 'Every 10 days',
        ingredients: ['Pseudomonas fluorescens', 'Water']
      },
      {
        name: 'Zinc Sulphate Application',
        description: 'Apply 25 kg/ha zinc sulphate to boost plant immunity.',
        frequency: 'Once at tillering stage',
        ingredients: ['Zinc sulphate']
      }
    ],
    preventionTips: [
      'Avoid excessive nitrogen application',
      'Maintain proper water management',
      'Plant resistant varieties (IR-36, Swarnadhan)',
      'Harvest at right maturity to minimize grain blast'
    ]
  },
  // GRAPE DISEASES
  'grape_black_rot': {
    cropType: 'Grape',
    diseaseName: 'Black Rot',
    pathogenType: 'Fungal',
    scientificName: 'Guignardia bidwellii',
    severity: 'High',
    affectedArea: 55,
    organicTreatments: [
      {
        name: 'Lime Sulphur Spray',
        description: 'Apply diluted lime sulphur (1:50) during dormancy and pre-bloom.',
        frequency: 'At bud break, pre-bloom, post-bloom',
        ingredients: ['Lime sulphur concentrate', 'Water']
      },
      {
        name: 'Copper Hydroxide',
        description: 'Apply copper hydroxide sprays during the growing season.',
        frequency: 'Every 7–10 days when wet',
        ingredients: ['Copper hydroxide', 'Water']
      }
    ],
    preventionTips: [
      'Remove mummified berries from vines',
      'Prune to open the canopy for airflow',
      'Remove infected shoot tips promptly',
      'Begin sprays before rainy weather'
    ]
  },
  // APPLE DISEASES
  'apple_scab': {
    cropType: 'Apple',
    diseaseName: 'Apple Scab',
    pathogenType: 'Fungal',
    scientificName: 'Venturia inaequalis',
    severity: 'High',
    affectedArea: 48,
    organicTreatments: [
      {
        name: 'Sulphur Spray',
        description: 'Apply micronized wettable sulphur at green tip and petal fall stages.',
        frequency: 'Every 7–10 days during spring',
        ingredients: ['Wettable sulphur', 'Water']
      },
      {
        name: 'Lime Sulphur + Neem Oil',
        description: 'Combination spray for early season control before green tip.',
        frequency: 'Dormant season application',
        ingredients: ['Lime sulphur', 'Neem oil', 'Water']
      }
    ],
    preventionTips: [
      'Choose scab-resistant apple varieties',
      'Rake and destroy fallen leaves in autumn',
      'Ensure good canopy airflow through pruning',
      'Apply urea to fallen leaves in autumn to speed decomposition'
    ]
  }
};

const DISEASE_KEYS = Object.keys(DISEASE_DATABASE);

/**
 * Simulated AI disease detection engine.
 * In a real system, this would call a TensorFlow/PyTorch CNN model.
 * Here we use a deterministic hash of the filename + timestamp to
 * produce realistic, reproducible-looking results.
 */
function analyzeImage(filename, mimetype) {
  // Deterministic seed from filename
  let hash = 0;
  const seed = filename + mimetype;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const absHash = Math.abs(hash);

  // Pick disease from database
  const diseaseKey = DISEASE_KEYS[absHash % DISEASE_KEYS.length];
  const disease = DISEASE_DATABASE[diseaseKey];

  // Realistic confidence score (85% – 98%)
  const confidence = 85 + (absHash % 13) + parseFloat((Math.random() * 0.9).toFixed(1));

  return {
    cropType: disease.cropType,
    diseaseName: disease.diseaseName,
    pathogenType: disease.pathogenType,
    scientificName: disease.scientificName,
    confidence: Math.min(parseFloat(confidence.toFixed(1)), 99.0),
    severity: disease.severity,
    affectedArea: disease.affectedArea,
    organicTreatments: disease.organicTreatments,
    preventionTips: disease.preventionTips
  };
}

module.exports = { analyzeImage };
