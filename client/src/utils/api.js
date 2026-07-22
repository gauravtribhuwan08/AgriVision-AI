import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Authentication
export const loginUser = (data) => api.post('/auth/login', data);
export const signupUser = (data) => api.post('/auth/signup', data);
export const getMe = () => api.get('/auth/me');

// Disease Detection
export const diagnoseLeaf = (formData, onProgress) =>
  api.post('/diagnose', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });

export const getDiagnosisHistory = () => api.get('/diagnose/history');
export const getDiagnosis = (id) => api.get(`/diagnose/${id}`);

// Soil Prediction
export const predictSoil = (data) => api.post('/soil/predict', data);
export const getSoilHistory = () => api.get('/soil/history');
export const getSoilPrediction = (id) => api.get(`/soil/${id}`);

// Weather
export const getWeather = (lat, lon) => api.get(`/weather/${lat}/${lon}`);

// Chatbot
export const chatWithBot = (data) => api.post('/chatbot', data);

// Health
export const checkHealth = () => api.get('/health');

export default api;