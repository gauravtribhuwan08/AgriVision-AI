import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell } from 'recharts';

const NUTRIENT_COLORS = {
  nitrogen: '#00e676',
  phosphorus: '#14b8a6',
  potassium: '#f59e0b',
  ph: '#a78bfa',
  organicCarbon: '#60a5fa',
  moisture: '#38bdf8',
};

const NUTRIENT_LABELS = {
  nitrogen: 'Nitrogen (N)',
  phosphorus: 'Phosphorus (P)',
  potassium: 'Potassium (K)',
  ph: 'pH Value',
  organicCarbon: 'Organic Carbon',
  moisture: 'Moisture %',
};

const NUTRIENT_UNITS = {
  nitrogen: 'kg/ha',
  phosphorus: 'kg/ha',
  potassium: 'kg/ha',
  ph: '',
  organicCarbon: '%',
  moisture: '%',
};

const IDEAL_RANGES = {
  nitrogen: { min: 200, max: 280, unit: 'kg/ha' },
  phosphorus: { min: 20, max: 40, unit: 'kg/ha' },
  potassium: { min: 150, max: 250, unit: 'kg/ha' },
  ph: { min: 6.0, max: 7.5, unit: '' },
  organicCarbon: { min: 0.75, max: 1.5, unit: '%' },
  moisture: { min: 40, max: 65, unit: '%' },
};

function getNutrientStatus(key, value) {
  const ideal = IDEAL_RANGES[key];
  if (!ideal) return 'normal';
  if (value < ideal.min * 0.7) return 'critical';
  if (value < ideal.min) return 'low';
  if (value > ideal.max * 1.3) return 'high';
  if (value > ideal.max) return 'elevated';
  return 'optimal';
}

const STATUS_COLORS = {
  optimal: 'var(--sev-none)',
  elevated: 'var(--sev-low)',
  low: 'var(--sev-medium)',
  high: 'var(--sev-high)',
  critical: 'var(--sev-critical)',
  normal: 'var(--text-secondary)',
};

const STATUS_LABELS = {
  optimal: '✅ Optimal',
  elevated: '↑ Elevated',
  low: '↓ Low',
  high: '↑↑ High',
  critical: '⚠️ Critical',
  normal: '— Normal',
};

function NutrientGauge({ label, value, color, unit, maxVal, status }) {
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const percent = Math.min(value / maxVal, 1);
  const offset = circ - percent * circ;

  return (
    <div className="nutrient-gauge">
      <div className="gauge-ring">
        <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--bg-700)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)',
              filter: `drop-shadow(0 0 6px ${color})`
            }}
          />
        </svg>
        <div className="gauge-label">
          <span className="gauge-value" style={{ color, fontSize: '0.9rem' }}>
            {typeof value === 'number' && value < 10 ? value.toFixed(1) : Math.round(value)}
          </span>
          <span className="gauge-unit">{unit}</span>
        </div>
      </div>
      <span className="gauge-name">{label}</span>
      <span style={{ fontSize: '0.6875rem', color: STATUS_COLORS[status], fontWeight: 600 }}>
        {STATUS_LABELS[status]}
      </span>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-750)', border: '1px solid var(--glass-border)',
        borderRadius: '10px', padding: '12px 16px', boxShadow: 'var(--shadow-lg)'
      }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: '0.875rem' }}>
            {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function NutrientChart({ nutrients }) {
  if (!nutrients) return null;

  const keys = Object.keys(NUTRIENT_LABELS);

  const barData = keys.map(key => ({
    name: key === 'organicCarbon' ? 'OC' : key.charAt(0).toUpperCase() + key.slice(1, 4),
    fullName: NUTRIENT_LABELS[key],
    value: nutrients[key],
    color: NUTRIENT_COLORS[key],
  }));

  const radarData = keys.map(key => {
    const ideal = IDEAL_RANGES[key];
    const percent = ideal ? Math.min((nutrients[key] / ideal.max) * 100, 120) : 50;
    return { subject: key === 'organicCarbon' ? 'Org.C' : key.slice(0, 3).toUpperCase(), value: Math.round(percent) };
  });

  return (
    <div>
      {/* Gauges */}
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        📊 Nutrient Levels
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {keys.map(key => {
          const maxVals = { nitrogen: 400, phosphorus: 60, potassium: 350, ph: 10, organicCarbon: 2, moisture: 100 };
          const status = getNutrientStatus(key, nutrients[key]);
          return (
            <div key={key} className="glass-card-inner" style={{ padding: '16px', textAlign: 'center' }}>
              <NutrientGauge
                label={key === 'organicCarbon' ? 'Org. Carbon' : key.charAt(0).toUpperCase() + key.slice(1)}
                value={nutrients[key]}
                color={NUTRIENT_COLORS[key]}
                unit={NUTRIENT_UNITS[key]}
                maxVal={maxVals[key]}
                status={status}
              />
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-card-inner" style={{ padding: '20px' }}>
          <h4 style={{ marginBottom: '16px', fontSize: '0.9375rem' }}>Nutrient Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card-inner" style={{ padding: '20px' }}>
          <h4 style={{ marginBottom: '16px', fontSize: '0.9375rem' }}>Soil Health Radar</h4>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: 'var(--text-muted)', fontSize: 9 }} domain={[0, 120]} />
              <Radar
                name="Soil Level"
                dataKey="value"
                stroke="var(--green-primary)"
                fill="var(--green-primary)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
