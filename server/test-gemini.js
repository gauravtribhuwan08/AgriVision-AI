require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
  console.log('Testing Gemini API key:', process.env.GEMINI_API_KEY ? 'FOUND (starts with ' + process.env.GEMINI_API_KEY.substring(0, 7) + '...)' : 'MISSING');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('Please add GEMINI_API_KEY to your .env file first!');
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log('Sending request to gemini-flash-lite-latest...');
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: 'Hello! Respond with "Gemini 2.0 Lite is working!" to confirm connection.'
    });
    console.log('\nResponse from Gemini:\n', response.text);
    console.log('\n🎉 SUCCESS! Your API key is fully working with Gemini 2.0 Flash Lite!');
  } catch (error) {
    console.error('\n❌ ERROR: Gemini API call failed:');
    console.error(error.message);
    console.log('\n👉 Tip: If you get a "Quota exceeded" or "limit: 0" error, please go to Google AI Studio, click "Create API Key", choose "+ Create project" to make a fresh project, and use the new key.');
  }
}

test();
