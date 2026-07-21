export default function FeatureCard({ icon, title, description, badge, delay = 0 }) {
  return (
    <div
      className="glass-card feature-card animate-fadeInUp"
      style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="feature-icon">{icon}</div>
      {badge && (
        <span className="badge badge-green" style={{ marginBottom: '12px' }}>
          {badge}
        </span>
      )}
      <h3 style={{ marginBottom: '12px' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', lineHeight: 1.75 }}>{description}</p>
    </div>
  );
}
