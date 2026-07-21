const fetch = require('node-fetch');
require('dotenv').config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Simulated weather fallback (realistic Indian weather data)
function getSimulatedWeather(lat, lon) {
  const seed = Math.abs(Math.floor(lat * 100 + lon * 10));
  const conditions = [
    { description: 'Partly Cloudy', icon: '02d', temp: 28, humidity: 68 },
    { description: 'Clear Sky', icon: '01d', temp: 32, humidity: 55 },
    { description: 'Light Rain', icon: '10d', temp: 24, humidity: 82 },
    { description: 'Overcast', icon: '04d', temp: 26, humidity: 75 },
    { description: 'Thunderstorm', icon: '11d', temp: 22, humidity: 90 },
    { description: 'Haze', icon: '50d', temp: 30, humidity: 65 }
  ];
  const selected = conditions[seed % conditions.length];
  const rainfall = selected.description.includes('Rain') || selected.description.includes('Thunder') ? 5 + (seed % 20) : 0;

  return {
    temperature: selected.temp + (seed % 6 - 3),
    feelsLike: selected.temp - 2,
    humidity: selected.humidity,
    rainfall,
    windSpeed: 5 + (seed % 15),
    description: selected.description,
    icon: selected.icon,
    forecast: generateSimulatedForecast(selected.temp, rainfall),
    source: 'simulated'
  };
}

function generateSimulatedForecast(baseTemp, baseRain) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    day,
    temp: baseTemp + (Math.sin(i) * 3).toFixed(0) * 1,
    rainfall: i % 3 === 0 ? baseRain : 0,
    icon: i % 3 === 0 ? '10d' : '01d'
  }));
}

async function getWeather(lat, lon) {
  if (!OPENWEATHER_API_KEY) {
    console.log('⚠️  No OpenWeather API key found. Using simulated weather data.');
    return getSimulatedWeather(lat, lon);
  }

  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&cnt=7`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(url),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok) {
      throw new Error(`OpenWeather API error: ${currentRes.status}`);
    }

    const current = await currentRes.json();
    const forecastData = forecastRes.ok ? await forecastRes.json() : null;

    const forecast = forecastData
      ? forecastData.list.map(item => ({
          day: new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          rainfall: item.rain ? item.rain['3h'] || 0 : 0,
          icon: item.weather[0].icon
        }))
      : generateSimulatedForecast(current.main.temp, 0);

    return {
      temperature: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      rainfall: current.rain ? current.rain['1h'] || 0 : 0,
      windSpeed: Math.round(current.wind.speed * 3.6), // m/s → km/h
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      forecast,
      source: 'openweathermap'
    };
  } catch (error) {
    console.error('Weather API error:', error.message, '— using simulated data');
    return getSimulatedWeather(lat, lon);
  }
}

module.exports = { getWeather };
