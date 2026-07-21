# 🌱 AgriVision AI

**Smart Crop Diagnosis & Predictive Soil Intelligence for Sustainable Agriculture**

> Team Techno_VG · Gaurav Tribhuwan · Vedant Deshmukh

---

## 🏆 Hackathon Problem Statements

1. **Computer Vision Crop Disease Detection** — Upload smartphone leaf images → AI diagnosis → organic pest control
2. **Predictive Soil Nutrient Mapping** — Satellite telemetry + weather → NPK prediction → fertilizer schedules

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Start the Backend Server

```bash
cd server
npm install
npm start
```

Server runs on: `http://localhost:5000`

### 2. Start the Frontend

```bash
cd client
npm install
npm run dev
```

App runs on: `http://localhost:5173`

---

## 🔧 Configuration

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agrivision
OPENWEATHER_API_KEY=your_api_key_here   # Optional — app works without it
```

Get a free OpenWeatherMap API key at: https://openweathermap.org/api

---

## 📁 Project Structure

```
hackathon/
├── client/          # React 18 + Vite frontend
│   └── src/
│       ├── components/   # Navbar, Footer, ImageUploader, DiagnosisCard, NutrientMap, etc.
│       ├── pages/        # Landing, DiseaseDetection, SoilDashboard, History, About
│       └── utils/        # API client (axios)
│
└── server/          # Node.js + Express backend
    ├── config/      # MongoDB connection
    ├── models/      # Diagnosis, SoilPrediction schemas
    ├── routes/      # /api/diagnose, /api/soil, /api/weather
    └── services/    # diseaseEngine, soilEngine, weatherService
```

---

## 🌟 Features

- 📷 **Drag & Drop Image Upload** with real-time scanning animation
- 🔬 **AI Disease Detection** across 12+ diseases, 6 crop types
- 🌿 **Organic Treatment Plans** with ingredients and frequency
- 🛰️ **Soil Nutrient Prediction** (N, P, K, pH, moisture, organic carbon)
- 🗺️ **Interactive Leaflet Maps** with color-coded heatmap overlay
- 📊 **Recharts Gauges & Radar** for nutrient visualization
- 🌤️ **Live Weather Integration** (OpenWeatherMap or simulated)
- 📅 **12-Week Fertilizer Schedules** with week badges and notes
- 📋 **MongoDB History** for all diagnoses and predictions
- 🎨 **Premium Dark UI** with glassmorphism and micro-animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Maps | Leaflet, react-leaflet |
| Charts | Recharts |
| Styling | Vanilla CSS (custom design system) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| File Upload | Multer |
| Weather | OpenWeatherMap API |
| HTTP Client | Axios |

---

*"Empowering Sustainable Agriculture through AI & Computer Vision"*
"# AgriVision-AI" 
