import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import StatsCounter from '../components/StatsCounter';

const features = [
  {
    icon: '🔬',
    title: 'AI Crop Disease Detection',
    description: 'Upload a smartphone leaf photo and our computer vision model instantly diagnoses diseases with 95%+ accuracy, identifying the pathogen type and severity.',
    badge: 'Computer Vision',
  },
  {
    icon: '🌿',
    title: 'Organic Treatment Plans',
    description: 'Receive tailored organic pest control recommendations including neem oil, copper sprays, Trichoderma, and compost teas — no harmful chemicals needed.',
    badge: 'Eco-Friendly',
  },
  {
    icon: '🛰️',
    title: 'Satellite Soil Intelligence',
    description: 'AI combines satellite telemetry, NDVI indices, and historical data to predict nitrogen, phosphorus, potassium, and pH levels across your field.',
    badge: 'Satellite AI',
  },
  {
    icon: '🌦️',
    title: 'Real-Time Weather Integration',
    description: 'Live weather data from OpenWeatherMap is fused with soil predictions to account for rainfall, humidity, and temperature impacts on nutrients.',
    badge: 'Live Data',
  },
  {
    icon: '🗺️',
    title: 'Interactive Nutrient Maps',
    description: 'Visualize soil health across your entire field on a color-coded interactive map. Click any zone to see detailed NPK readings and health scores.',
    badge: 'GIS Mapping',
  },
  {
    icon: '📅',
    title: 'Smart Fertilizer Schedules',
    description: 'Get AI-optimized 12-week fertilizer application schedules tailored to your soil deficiencies, crop type, and current weather conditions.',
    badge: 'AI Optimized',
  },
];

const steps = [
  {
    number: '01',
    icon: '📷',
    title: 'Upload Leaf Image',
    description: 'Take a photo of your crop leaf and upload it to our platform.',
    color: 'var(--green-primary)',
  },
  {
    number: '02',
    icon: '🔬',
    title: 'AI Analysis',
    description: 'Our computer vision model analyzes the image for diseases and pathogens.',
    color: 'var(--teal-400)',
  },
  {
    number: '03',
    icon: '🌿',
    title: 'Get Treatment Plan',
    description: 'Receive organic treatment recommendations and prevention tips.',
    color: 'var(--green-accent)',
  },
  {
    number: '04',
    icon: '🛰️',
    title: 'Map Your Soil',
    description: 'Enter farm location to get satellite-powered soil nutrient predictions.',
    color: 'var(--cyan-400, #22d3ee)',
  },
];

const stats = [
  { value: 54000, suffix: '+', label: 'Crop Images Analyzed' },
  { value: 38, suffix: '', label: 'Disease Classes Detected' },
  { value: 95.4, suffix: '%', label: 'Detection Accuracy' },
  { value: 12, suffix: ' crops', label: 'Crop Types Supported' },
];

export default function Landing() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '80px', paddingBottom: '80px' }}>
          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow animate-fadeInUp" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                🏆 Hackathon 2024 · Team Techno_VG
              </div>
              <h1 className="hero-title animate-fadeInUp delay-1" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                AI-Powered<br />
                <span className="gradient-text">Crop Diagnosis</span> &<br />
                Soil Intelligence
              </h1>
              <p className="hero-subtitle animate-fadeInUp delay-2" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                Detect crop diseases from smartphone images, predict soil nutrients using satellite data, and get AI-optimized fertilizer schedules — all in one platform.
              </p>
              <div className="hero-actions animate-fadeInUp delay-3" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                <Link to="/detect" className="btn btn-primary btn-lg">
                  🔬 Detect Disease Now
                </Link>
                <Link to="/soil" className="btn btn-secondary btn-lg">
                  🛰️ Soil Dashboard
                </Link>
              </div>
              <div className="hero-stats animate-fadeInUp delay-4" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                {[
                  { val: '95%+', label: 'Accuracy' },
                  { val: '38', label: 'Diseases' },
                  { val: '<5s', label: 'Analysis Time' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div className="hero-stat-value">{val}</div>
                    <div className="hero-stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Mockup */}
            <div className="hero-visual">
              <div className="device-mockup">
                <div className="device-screen">
                  {/* Mock Disease Result */}
                  <div style={{ background: 'var(--bg-800)', padding: '16px' }}>
                    <div style={{ height: 120, background: 'linear-gradient(135deg, #1a3a1a, #0d2810)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ fontSize: '3rem' }}>🍃</div>
                      <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', top: '40%', background: 'linear-gradient(90deg, transparent, #00e676, transparent)', animation: 'scan-line 2s linear infinite' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>Tomato Early Blight</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Alternaria solani • Fungal</div>
                      </div>
                      <div style={{ background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.7rem', color: '#00e676', fontWeight: 700 }}>
                        93.2%
                      </div>
                    </div>
                    <div style={{ height: 4, background: '#1a2540', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                      <div style={{ height: '100%', width: '93%', background: 'var(--gradient-green)', borderRadius: '4px' }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--green-primary)', fontWeight: 600, marginBottom: '6px' }}>🌿 Organic Treatment:</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px', borderLeft: '2px solid var(--green-primary)' }}>
                      Neem Oil Spray — Apply every 7 days
                    </div>
                  </div>
                </div>

                {/* Mock Soil Card below */}
                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Soil Health Score</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: '#00e676' }}>74%</div>
                    <div style={{ flex: 1 }}>
                      {['N', 'P', 'K'].map((n, i) => (
                        <div key={n} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '3px' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', width: 10 }}>{n}</span>
                          <div style={{ flex: 1, height: 3, background: '#1a2540', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${[70, 45, 80][i]}%`, background: ['#00e676', '#14b8a6', '#f59e0b'][i], borderRadius: '2px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: 'var(--space-16) 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)' }}>
        <div className="container">
          <div className="grid-4">
            {stats.map((s) => (
              <StatsCounter key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🚀 Platform Features</div>
            <h2 className="section-title">
              Complete <span className="gradient-text">Agricultural Intelligence</span>
            </h2>
            <p style={{ maxWidth: 560, margin: '0 auto', color: 'var(--text-secondary)' }}>
              From disease diagnosis to fertilizer scheduling — we've built the end-to-end pipeline that modern farmers need.
            </p>
          </div>
          <div className="grid-3">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" style={{ background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">🔄 Workflow</div>
            <h2 className="section-title">How <span className="gradient-text">AgriVision AI</span> Works</h2>
          </div>
          <div className="grid-4">
            {steps.map((step, i) => (
              <div key={step.number} className="animate-fadeInUp" style={{ animationDelay: `${i * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                <div className="glass-card" style={{ padding: '28px', textAlign: 'center', position: 'relative' }}>
                  {i < steps.length - 1 && (
                    <div style={{
                      position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
                      fontSize: '1.25rem', zIndex: 1, display: 'none'
                    }}>→</div>
                  )}
                  <div style={{
                    width: 70, height: 70, borderRadius: '50%',
                    background: 'var(--glass-bg-md)', border: `2px solid ${step.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.75rem', margin: '0 auto 16px',
                    boxShadow: `0 0 20px ${step.color}30`
                  }}>
                    {step.icon}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900,
                    color: step.color, opacity: 0.4, lineHeight: 1, marginBottom: '8px'
                  }}>
                    {step.number}
                  </div>
                  <h3 style={{ marginBottom: '12px', fontSize: '1.0625rem' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.75 }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="glass-card animate-pulse-glow" style={{ padding: '64px 32px', maxWidth: 700, margin: '0 auto', background: 'linear-gradient(135deg, rgba(0,230,118,0.05), rgba(20,184,166,0.05))' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌱</div>
            <h2 style={{ marginBottom: '16px' }}>
              Ready to Transform Your <span className="gradient-text">Farm?</span>
            </h2>
            <p style={{ marginBottom: '32px', maxWidth: 480, margin: '0 auto 32px' }}>
              Join thousands of farmers using AI to detect diseases early and optimize their soil nutrition for maximum yield.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/detect" className="btn btn-primary btn-lg">
                🔬 Start Disease Detection
              </Link>
              <Link to="/soil" className="btn btn-outline btn-lg">
                🛰️ Explore Soil Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
