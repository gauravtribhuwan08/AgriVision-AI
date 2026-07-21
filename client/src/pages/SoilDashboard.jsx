import { useState } from 'react';
import { toast } from 'react-toastify';
import NutrientMap from '../components/NutrientMap';
import NutrientChart from '../components/NutrientChart';
import FertilizerSchedule from '../components/FertilizerSchedule';
import WeatherWidget from '../components/WeatherWidget';
import Loader from '../components/Loader';
import { predictSoil } from '../utils/api';

const PRESET_LOCATIONS = [
  { name: 'Mumbai, Maharashtra', lat: 19.076, lon: 72.877 },
  { name: 'Pune, Maharashtra', lat: 18.52, lon: 73.856 },
  { name: 'Nashik, Maharashtra', lat: 19.997, lon: 73.79 },
  { name: 'Nagpur, Maharashtra', lat: 21.145, lon: 79.088 },
  { name: 'Delhi, NCR', lat: 28.704, lon: 77.102 },
  { name: 'Bengaluru, Karnataka', lat: 12.971, lon: 77.594 },
  { name: 'Hyderabad, Telangana', lat: 17.385, lon: 78.486 },
  { name: 'Ludhiana, Punjab', lat: 30.901, lon: 75.857 },
];

const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Loamy', 'Sandy', 'Clay', 'Mountain'];

const TABS = ['🗺️ Nutrient Map', '📊 Nutrient Analysis', '📅 Fertilizer Schedule', '🌤️ Weather'];

export default function SoilDashboard() {
  const [form, setForm] = useState({ lat: '', lon: '', locationName: '', soilType: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handlePreset = (loc) => {
    setForm({ ...form, lat: loc.lat.toString(), lon: loc.lon.toString(), locationName: loc.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lat = parseFloat(form.lat);
    const lon = parseFloat(form.lon);

    if (isNaN(lat) || isNaN(lon)) {
      toast.error('Please enter valid latitude and longitude coordinates.');
      return;
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      toast.error('Coordinates out of valid range.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await predictSoil({ lat, lon, locationName: form.locationName, soilType: form.soilType });
      setResult(res.data.data);
      toast.success('🛰️ Soil analysis complete!');
      setActiveTab(0);
    } catch (error) {
      const msg = error.response?.data?.message || 'Prediction failed. Is the server running?';
      toast.error(`❌ ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'var(--sev-none)';
    if (score >= 60) return 'var(--sev-low)';
    if (score >= 40) return 'var(--sev-medium)';
    if (score >= 20) return 'var(--sev-high)';
    return 'var(--sev-critical)';
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Poor';
    return 'Critical';
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <div className="page-badge">🛰️ Satellite AI + Weather Data</div>
              <h1>Soil Nutrient <span className="gradient-text">Dashboard</span></h1>
              <p style={{ maxWidth: 520, marginTop: '12px' }}>
                Enter your farm coordinates to get AI-powered soil nutrient predictions using satellite telemetry,
                weather patterns, and historical soil data.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '28px', alignItems: 'start' }}>
          {/* Left: Input Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📍 Farm Location
              </h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label">Location Name (Optional)</label>
                  <input
                    className="input"
                    placeholder="e.g. My Farm, Maharashtra"
                    value={form.locationName}
                    onChange={e => setForm({ ...form, locationName: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Latitude</label>
                    <input
                      className="input"
                      placeholder="e.g. 19.076"
                      value={form.lat}
                      onChange={e => setForm({ ...form, lat: e.target.value })}
                      type="number"
                      step="0.001"
                      min="-90" max="90"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Longitude</label>
                    <input
                      className="input"
                      placeholder="e.g. 72.877"
                      value={form.lon}
                      onChange={e => setForm({ ...form, lon: e.target.value })}
                      type="number"
                      step="0.001"
                      min="-180" max="180"
                      required
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Soil Type (Optional)</label>
                  <select className="input" value={form.soilType} onChange={e => setForm({ ...form, soilType: e.target.value })}>
                    <option value="">Auto-detect from location</option>
                    {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isLoading ? (
                    <><div className="loader-ring" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing...</>
                  ) : '🛰️ Predict Soil Nutrients'}
                </button>
              </form>
            </div>

            {/* Quick Location Presets */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h4 style={{ marginBottom: '14px', fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                📌 Quick Locations
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {PRESET_LOCATIONS.map(loc => (
                  <button
                    key={loc.name}
                    onClick={() => handlePreset(loc)}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', textAlign: 'left', borderRadius: 'var(--radius-md)' }}
                  >
                    📍 {loc.name}
                  </button>
                ))}
              </div>
            </div>

            {/* NDVI & Soil Score */}
            {result && (
              <div className="glass-card animate-scaleIn" style={{ padding: '24px', animationFillMode: 'forwards' }}>
                <h4 style={{ marginBottom: '16px' }}>🌍 Overview</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Soil Health Score</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: getHealthColor(result.soilHealthScore) }}>
                      {result.soilHealthScore}/100
                    </span>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${result.soilHealthScore}%`, background: getHealthColor(result.soilHealthScore) }} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div className="glass-card-inner" style={{ padding: '10px 14px', flex: 1 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>STATUS</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: getHealthColor(result.soilHealthScore) }}>
                        {getHealthLabel(result.soilHealthScore)}
                      </div>
                    </div>
                    <div className="glass-card-inner" style={{ padding: '10px 14px', flex: 1 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>NDVI</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--green-primary)' }}>
                        {result.ndviIndex}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Soil Type: <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{result.soilType}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Location: <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{result.location.name}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div>
            {isLoading ? (
              <div className="glass-card" style={{ padding: '60px 32px' }}>
                <Loader text="Analyzing satellite telemetry and weather patterns..." size="lg" />
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['🛰️ Fetching satellite data', '🌦️ Analyzing weather', '🧮 Computing NPK levels', '📅 Generating schedule'].map((s, i) => (
                      <span key={i} className="badge badge-green" style={{ animationDelay: `${i * 0.3}s` }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : result ? (
              <div>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {TABS.map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(i)}
                      className={`btn ${activeTab === i ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-md)' }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Panels */}
                <div className="glass-card animate-fadeIn" style={{ padding: '28px', animationFillMode: 'forwards' }}>
                  {activeTab === 0 && (
                    <NutrientMap
                      location={result.location}
                      mapData={result.mapData}
                      soilHealthScore={result.soilHealthScore}
                    />
                  )}
                  {activeTab === 1 && (
                    <NutrientChart nutrients={result.nutrients} />
                  )}
                  {activeTab === 2 && (
                    <FertilizerSchedule schedule={result.fertilizerSchedule} />
                  )}
                  {activeTab === 3 && (
                    <WeatherWidget weather={result.weatherData} />
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '80px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>🛰️</div>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 500 }}>
                  Enter Farm Location
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto 24px' }}>
                  Select a preset location or enter custom coordinates to generate AI-powered soil nutrient predictions.
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['🛰️ Satellite Data', '🌦️ Weather API', '🧮 AI Prediction', '🗺️ Nutrient Map', '📅 Fertilizer Plan'].map(tag => (
                    <span key={tag} className="badge badge-gray">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
