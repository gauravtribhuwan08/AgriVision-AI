// ============================================================
// AgriBot Chatbot Service — Powered by Google Gemini AI
// Fallback engine provides localized agricultural expert responses
// ============================================================

const { GoogleGenAI } = require('@google/genai');

// Heuristic FAQ database for fallback mode
const FALLBACK_ANSWERS = [
  {
    keys: ['hello', 'hi', 'hey', 'greetings', 'start'],
    reply: "Hello! I am AgriBot, your personal agricultural assistant. I can help you diagnose crop diseases, understand soil nutrients, plan fertilizer schedules, and check weather conditions. How can I help you today?"
  },
  {
    keys: ['disease', 'blight', 'spot', 'mold', 'fungal', 'bacterial', 'viral', 'pest', 'leaf', 'sick', 'diagnos'],
    reply: "If you suspect your crops are infected, you can upload a leaf photo to our **Detect Disease** portal for a real-time computer vision scan. For organic prevention, remember to use **Neem Oil Spray** or **Baking Soda solutions**, ensure proper plant spacing for airflow, and avoid watering the foliage directly (use drip irrigation)."
  },
  {
    keys: ['soil', 'nutrient', 'npk', 'nitrogen', 'phosphorus', 'potassium', 'ph', 'organic carbon', 'sandy', 'clay', 'loam'],
    reply: "Soil nutrient levels (N, P, K) dictate plant vigor. If Nitrogen is low, try adding **Farm Yard Manure** or **Vermicompost** for an organic boost. Low Phosphorus can be corrected with **Bone Meal** or **Rock Phosphate**, while Potassium is boosted using **Wood Ash**. Check out the **Soil Dashboard** to map your specific coordinates."
  },
  {
    keys: ['fertilizer', 'schedule', 'apply', 'manure', 'urea'],
    reply: "For sustainable farming, we recommend a split application of fertilizers. A typical 12-week schedule starts with basal Farm Yard Manure, followed by vegetative Nitrogen top-dressing, mid-season Phosphorus support, and a pre-harvest seaweed foliar spray. Try to use neem-coated urea to minimize nitrogen volatilization."
  },
  {
    keys: ['weather', 'rain', 'temperature', 'humidity', 'wind'],
    reply: "Weather heavily impacts agricultural treatments. For example, never apply foliar sprays right before a heavy rain forecast, as the nutrients will leach away. High humidity (>80%) combined with warm temperatures (20-30°C) also increases the risk of fungal diseases like Early Blight."
  },
  {
    keys: ['history', 'recent', 'my farm', 'what did i', 'previous'],
    reply: "I can check your farm history! If you are logged in, I have access to your recent leaf diagnoses and soil predictions. Ask me specifically about your diagnosed plants or soil health score to review them."
  }
];

function getFallbackReply(message, userHistoryText) {
  const msgLower = message.toLowerCase();
  
  // Try to check history questions first
  if (msgLower.includes('history') || msgLower.includes('recent') || msgLower.includes('diagnos') || msgLower.includes('soil')) {
    if (userHistoryText && !userHistoryText.includes('No recent')) {
      return `Based on your recent farm history:\n\n${userHistoryText}\n\nWhat specific details would you like to discuss?`;
    }
  }

  // Find keyword match
  for (const item of FALLBACK_ANSWERS) {
    if (item.keys.some(k => msgLower.includes(k))) {
      return item.reply;
    }
  }

  return "I'm here as your AgriBot assistant. I can answer questions about crop care, soil NPK levels, organic treatments, and fertilizer scheduling. Could you please specify which crop or coordinate you are working with?";
}

/**
 * Generate a response using Google Gemini 2.0 Flash or fall back to heuristic replies.
 * 
 * @param {string} message - User's message
 * @param {Array} chatHistory - Conversational message history
 * @param {Object} userHistory - Object containing { diagnoses: [...], soilPredictions: [...] }
 */
async function generateResponse(message, chatHistory = [], userHistory = {}) {
  // Format user history context
  let userHistoryText = '';
  
  const recentDiagnoses = userHistory.diagnoses || [];
  if (recentDiagnoses.length > 0) {
    userHistoryText += 'Recent Leaf Diagnoses:\n';
    recentDiagnoses.forEach((d, idx) => {
      userHistoryText += `- Crop: ${d.cropType}, Disease: ${d.diseaseName}, Severity: ${d.severity}, Pathogen: ${d.pathogenType} (Date: ${new Date(d.createdAt).toLocaleDateString()})\n`;
    });
  } else {
    userHistoryText += 'No recent crop disease diagnoses recorded.\n';
  }

  const recentSoils = userHistory.soilPredictions || [];
  if (recentSoils.length > 0) {
    userHistoryText += '\nRecent Soil Predictions:\n';
    recentSoils.forEach((s, idx) => {
      const loc = s.location?.name || `${s.location?.lat}, ${s.location?.lon}`;
      userHistoryText += `- Location: ${loc}, Soil Type: ${s.soilType}, Health Score: ${s.soilHealthScore}%, NPK: N=${s.nutrients?.nitrogen}, P=${s.nutrients?.phosphorus}, K=${s.nutrients?.potassium} (Date: ${new Date(s.createdAt).toLocaleDateString()})\n`;
    });
  } else {
    userHistoryText += 'No recent soil health predictions recorded.\n';
  }

  const SYSTEM_PROMPT = `You are AgriBot, a friendly and expert agricultural consultant and AI pathologist for AgriVision AI.
Your purpose is to help farmers diagnose crop diseases, understand soil health, recommend organic pest controls, optimize fertilizer schedules, and interpret weather impacts.

Always:
- Provide highly practical, scientifically accurate, and easy-to-understand advice for farmers.
- Prioritize organic, eco-friendly, and sustainable treatments (like Neem oil, wood ash, compost, Trichoderma, crop rotation, hilling).
- Structure your responses with clear formatting, using bold text, bullet points, and numbered lists where appropriate for readability.
- Keep your tone supportive, encouraging, and professional.
- If the user asks about their recent diagnoses or soil predictions, reference the context below.

Context about this user's farm profile:
${userHistoryText}

Answer the user's question, keeping the context in mind if they ask about their crop or soil history.`;

  // Map history to standard Gemini SDK roles
  const contents = [];
  
  // Format previous messages
  chatHistory.forEach(msg => {
    if (msg.sender && msg.text) {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }
  });

  // Append new user message
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  // Try calling Gemini API
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      console.log('📡 Requesting AgriBot Chat response from Gemini (Gemini Flash Lite)...');
      
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-flash-lite-latest',
          contents: contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.7,
          }
        });
      } catch (err) {
        console.warn('⚠️ Gemini Flash Lite request failed, trying gemini-2.0-flash...');
        response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.7,
          }
        });
      }

      const replyText = response.text;
      if (replyText) {
        console.log('✅ AgriBot response generated via Gemini');
        return {
          text: replyText.trim(),
          isSimulated: false
        };
      }
    } catch (err) {
      console.warn('❌ AgriBot Gemini calls failed:', err.message, '— falling back to heuristic engine');
    }
  }

  // Heuristic offline engine fallback
  console.log('🔄 AgriBot falling back to heuristic answers');
  const fallbackReply = getFallbackReply(message, userHistoryText);
  return {
    text: fallbackReply,
    isSimulated: true
  };
}

module.exports = { generateResponse };
