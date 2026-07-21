import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDiagnosisHistory, getSoilHistory } from '../utils/api';
import Loader from '../components/Loader';

const SEVERITY_COLORS = { None: 'green', Low: 'green', Medium: 'amber', High: 'orange', Critical: 'red' };
const HEALTH_COLORS = (s) => s >= 80 ? 'green' : s >= 60 ? 'teal' : s >= 40 ? 'amber' : s >= 20 ? 'orange' : 'red';

export default function History() {
  const [activeTab, setActiveTab] = useState('disease');
  const [diagnoses, setDiagnoses] = useState([]);
  const [soilPredictions, setSoilPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dRes, sRes] = await Promise.all([getDiagnosisHistory(), getSoilHistory()]);
      setDiagnoses(dRes.data.data || []);
      setSoilPredictions(sRes.data.data || []);
    } catch (err) {
      setError('Could not load history. Make sure MongoDB is connected and the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const PATHOGEN_ICONS = { Fungal: '🍄', Bacterial: '🦠', Viral: '🧬', 'Nutrient Deficiency': '⚗️', Healthy: '✅' };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <div className="page-badge">📋 Analysis History</div>
              <h1>Your <span className="gradient-text">Analysis History</span></h1>
              <p style={{ maxWidth: 480, marginTop: '12px' }}>
                View all past crop disease diagnoses and soil nutrient predictions stored in your database.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/detect" className="btn btn-primary">🔬 New Analysis</Link>
              <Link to="/soil" className="btn btn-secondary">🛰️ Soil Prediction</Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          <button
            onClick={() => setActiveTab('disease')}
            className={`btn ${activeTab === 'disease' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🔬 Disease Diagnoses {diagnoses.length > 0 && <span className="badge badge-green" style={{ marginLeft: '6px' }}>{diagnoses.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('soil')}
            className={`btn ${activeTab === 'soil' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🛰️ Soil Predictions {soilPredictions.length > 0 && <span className="badge badge-teal" style={{ marginLeft: '6px' }}>{soilPredictions.length}</span>}
          </button>
        </div>

        {loading ? (
          <div className="glass-card" style={{ padding: '60px' }}>
            <Loader text="Loading history from database..." />
          </div>
        ) : error ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ color: 'var(--earth-amber)', marginBottom: '12px' }}>Database Not Connected</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: 400, margin: '0 auto 24px' }}>
              {error}
            </p>
            <button onClick={fetchAll} className="btn btn-outline">🔄 Retry</button>
          </div>
        ) : activeTab === 'disease' ? (
          <>
            {diagnoses.length === 0 ? (
              <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '16px', opacity: 0.5 }}>🍃</div>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 500 }}>No Diagnoses Yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Start by uploading a leaf image for disease detection.</p>
                <Link to="/detect" className="btn btn-primary">🔬 Detect Disease</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {diagnoses.map((item, i) => (
                  <div key={item._id} className="glass-card animate-fadeInUp" style={{
                    padding: '24px',
                    animationDelay: `${i * 60}ms`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 'var(--radius-md)',
                        background: 'var(--glass-bg-md)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.75rem', flexShrink: 0
                      }}>
                        {PATHOGEN_ICONS[item.pathogenType] || '🌿'}
                      </div>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <span className={`badge badge-${SEVERITY_COLORS[item.severity] || 'gray'}`}>
                            {item.severity}
                          </span>
                          <span className="badge badge-teal">{item.pathogenType}</span>
                          <span className="badge badge-gray">🌿 {item.cropType}</span>
                        </div>
                        <h4 style={{ marginBottom: '4px' }}>{item.diseaseName}</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          Confidence: <strong style={{ color: 'var(--green-primary)' }}>{item.confidence}%</strong>
                          {item.affectedArea > 0 && ` · Affected: ~${item.affectedArea}%`}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          {new Date(item.createdAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(item.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {item.organicTreatments?.length > 0 && (
                          <span className="badge badge-green" style={{ marginTop: '6px' }}>
                            {item.organicTreatments.length} Treatments
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {soilPredictions.length === 0 ? (
              <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '16px', opacity: 0.5 }}>🛰️</div>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 500 }}>No Soil Predictions Yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Run a soil nutrient prediction from the Soil Dashboard.</p>
                <Link to="/soil" className="btn btn-primary">🛰️ Soil Dashboard</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {soilPredictions.map((item, i) => (
                  <div key={item._id} className="glass-card animate-fadeInUp" style={{
                    padding: '24px',
                    animationDelay: `${i * 60}ms`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 'var(--radius-md)',
                        background: 'var(--glass-bg-md)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.75rem', flexShrink: 0
                      }}>
                        🗺️
                      </div>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <span className={`badge badge-${HEALTH_COLORS(item.soilHealthScore)}`}>
                            Health: {item.soilHealthScore}/100
                          </span>
                          <span className="badge badge-gray">{item.soilType}</span>
                        </div>
                        <h4 style={{ marginBottom: '4px' }}>{item.location?.name || 'Unknown Location'}</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          N: {item.nutrients?.nitrogen?.toFixed(0)} · P: {item.nutrients?.phosphorus?.toFixed(0)} · K: {item.nutrients?.potassium?.toFixed(0)} kg/ha
                          &nbsp;·&nbsp; pH: {item.nutrients?.ph?.toFixed(1)}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          {new Date(item.createdAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Lat: {item.location?.lat?.toFixed(3)}, Lon: {item.location?.lon?.toFixed(3)}
                        </p>
                        {item.ndviIndex && (
                          <span className="badge badge-teal" style={{ marginTop: '6px' }}>
                            NDVI: {item.ndviIndex}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
