export default function FertilizerSchedule({ schedule = [] }) {
  if (!schedule.length) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          📅 Smart Fertilizer Schedule
        </h3>
        <span className="badge badge-green">AI Optimized</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {schedule.map((item, i) => (
          <div
            key={i}
            className="glass-card-inner animate-fadeInUp"
            style={{
              padding: '20px',
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start',
              animationDelay: `${i * 80}ms`,
              opacity: 0,
              animationFillMode: 'forwards',
              borderLeft: '3px solid var(--green-primary)',
            }}
          >
            {/* Week Badge */}
            <div className="week-badge">
              <span>{item.week}</span>
              <span>WK</span>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h4 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🌿 {item.fertilizer}
                </h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-teal">⚗️ {item.nutrientTarget}</span>
                  <span className="badge badge-amber">⚖️ {item.quantity}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Application:
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--teal-400, #2dd4bf)', fontWeight: 500 }}>
                  {item.method}
                </span>
              </div>

              {item.notes && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(0,230,118,0.05)',
                  border: '1px solid rgba(0,230,118,0.15)',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.75
                }}>
                  💡 {item.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Timeline summary */}
      <div className="glass-card" style={{ padding: '20px', marginTop: '24px' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
          Season Timeline
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto', paddingBottom: '8px' }}>
          {schedule.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '6px', padding: '0 8px'
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: 'var(--green-primary)',
                  boxShadow: '0 0 8px rgba(0,230,118,0.5)'
                }} />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 60 }}>
                  Wk {item.week}
                </span>
                <span style={{ fontSize: '0.6rem', color: 'var(--green-primary)', textAlign: 'center', maxWidth: 60 }}>
                  {item.fertilizer.split(' ')[0]}
                </span>
              </div>
              {i < schedule.length - 1 && (
                <div style={{ height: 1, width: '30px', background: 'var(--glass-border)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
