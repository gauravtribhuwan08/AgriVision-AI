async function testHF() {
  console.log('Testing Hugging Face Inference API for plant disease detection...');
  const model = 'linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification';
  
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`);
    console.log('Hugging Face model status:', response.status === 200 || response.status === 401 ? 'REACHABLE' : 'ERROR', response.status);
    const data = await response.json();
    console.log('Response body:', JSON.stringify(data).substring(0, 200));
  } catch (error) {
    console.log('Hugging Face error:', error.message);
  }
}

testHF();
