import { useEffect, useRef } from 'react';

const PATHOGEN_ICONS = {
  Fungal: '🍄',
  Bacterial: '🦠',
  Viral: '🧬',
  'Nutrient Deficiency': '⚗️',
  Healthy: '✅',
};

const SEVERITY_COLORS = {
  None: 'var(--sev-none)',
  Low: 'var(--sev-low)',
  Medium: 'var(--sev-medium)',
  High: 'var(--sev-high)',
  Critical: 'var(--sev-critical)',
};

function ConfidenceRing({ confidence }) {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (confidence / 100) * circ;

  return (
    <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
      <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={radius} fill="none" stroke="var(--bg-700)" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={radius} fill="none"
          stroke="var(--green-primary)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)', filter: 'drop-shadow(0 0 8px var(--green-primary))' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 900, color: 'var(--green-primary)' }}>
          {confidence.toFixed(0)}%
        </span>
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Confidence
        </span>
      </div>
    </div>
  );
}

export default function DiagnosisCard({ data }) {
  if (!data) return null;

  const {
    cropType, diseaseName, pathogenType, scientificName,
    confidence, severity, affectedArea,
    organicTreatments = [], preventionTips = [],
    imagePath, createdAt
  } = data;

  const isHealthy = severity === 'None';
  const severityColor = SEVERITY_COLORS[severity] || SEVERITY_COLORS.None;

  return (
    <div className="animate-scaleIn" style={{ animationFillMode: 'forwards' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
          <ConfidenceRing confidence={confidence} />

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span className={`badge severity-${severity?.toLowerCase()}`}>
                {severity === 'None' ? '✅ Healthy' : `⚠️ ${severity}`}
              </span>
              <span className="badge badge-teal">
                {PATHOGEN_ICONS[pathogenType]} {pathogenType}
              </span>
              <span className="badge badge-gray">🌿 {cropType}</span>
            </div>

            <h2 style={{ marginBottom: '6px', color: isHealthy ? 'var(--green-primary)' : 'var(--text-primary)' }}>
              {isHealthy ? '✅ Healthy Leaf!' : diseaseName}
            </h2>

            {scientificName && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '8px' }}>
                {scientificName}
              </p>
            )}

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '12px' }}>
              {affectedArea > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Affected Area</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: severityColor }}>~{affectedArea}%</div>
                </div>
              )}
              {createdAt && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Analyzed</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{new Date(createdAt).toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Severity bar */}
        {!isHealthy && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Disease Severity</span>
              <span style={{ color: severityColor, fontWeight: 600 }}>{severity}</span>
            </div>
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{
                  width: `${{ None: 0, Low: 25, Medium: 50, High: 75, Critical: 95 }[severity]}%`,
                  background: severityColor,
                  boxShadow: `0 0 10px ${severityColor}50`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Organic Treatments */}
      {organicTreatments.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🌿 <span>Organic Treatment Plan</span>
            <span className="badge badge-green" style={{ marginLeft: '4px' }}>Recommended</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {organicTreatments.map((treatment, i) => (
              <div key={i} className="treatment-card animate-fadeInUp" style={{
                animationDelay: `${i * 100}ms`,
                opacity: 0, animationFillMode: 'forwards'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                  <h4 style={{ color: 'var(--green-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🌿</span> {treatment.name}
                  </h4>
                  <span className="badge badge-teal" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                    ⏱️ {treatment.frequency}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '10px' }}>
                  {treatment.description}
                </p>
                {treatment.ingredients?.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {treatment.ingredients.map((ing, j) => (
                      <span key={j} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                        {ing}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prevention Tips */}
      {preventionTips.length > 0 && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🛡️ Prevention Tips
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {preventionTips.map((tip, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--green-glow)', border: '1px solid var(--glass-border-green)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', color: 'var(--green-primary)', fontWeight: 700,
                  flexShrink: 0, marginTop: '2px'
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
