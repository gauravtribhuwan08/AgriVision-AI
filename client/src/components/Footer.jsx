import { Link } from 'react-router-dom';

const links = {
  Platform: [
    { label: 'Crop Disease Detection', to: '/detect' },
    { label: 'Soil Nutrient Dashboard', to: '/soil' },
    { label: 'Analysis History', to: '/history' },
    { label: 'About Us', to: '/about' },
  ],
  Resources: [
    { label: 'Disease Database', to: '/detect' },
    { label: 'Fertilizer Guide', to: '/soil' },
    { label: 'Weather Insights', to: '/soil' },
    { label: 'Organic Farming', to: '/detect' },
  ],
  Team: [
    { label: 'Techno_VG', to: '/about' },
    { label: 'Gaurav Tribhuwan', to: '/about' },
    { label: 'Vedant Deshmukh', to: '/about' },
    { label: 'Contact', to: '/about' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '12px' }}>
              <div className="logo-icon">🌱</div>
              <span className="logo-text" style={{ fontSize: '1.125rem' }}>Agri<span>Vision</span> AI</span>
            </Link>
            <p className="footer-brand-desc">
              AI-powered crop disease detection and predictive soil intelligence for sustainable agriculture.
              Empowering farmers with data-driven decisions.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {['🌿', '🛰️', '🔬', '📊'].map((icon, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--glass-bg-md)', border: '1px solid var(--glass-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p className="footer-heading">{section}</p>
              <ul className="footer-links">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 AgriVision AI. Built for Sustainable Agriculture.
          </p>
          <p className="footer-team">
            Team <span>Techno_VG</span> · Gaurav Tribhuwan · Vedant Deshmukh
          </p>
        </div>
      </div>
    </footer>
  );
}
