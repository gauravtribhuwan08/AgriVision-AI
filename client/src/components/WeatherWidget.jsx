export default function WeatherWidget({ weather }) {
  if (!weather) return null;

  const {
    temperature, feelsLike, humidity, rainfall,
    windSpeed, description, icon, forecast = []
  } = weather;

  const iconUrl = icon
    ? `https://openweathermap.org/img/wn/${icon}@2x.png`
    : null;

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          🌤️ Current Weather
        </h3>
        {weather.source === 'simulated' && (
          <span className="badge badge-gray">Simulated Data</span>
        )}
      </div>

      {/* Main Weather */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
        {iconUrl ? (
          <img src={iconUrl} alt={description} style={{ width: 72, height: 72 }} />
        ) : (
          <div style={{ fontSize: '3rem' }}>🌤️</div>
        )}
        <div>
          <div style={{
            fontFamily: 'var(--font-heading)', fontSize: '3rem',
            fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1
          }}>
            {temperature}°<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>C</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', textTransform: 'capitalize', marginTop: '4px' }}>
            {description}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px', marginBottom: '20px'
      }}>
        {[
          { icon: '🌡️', label: 'Feels Like', value: `${feelsLike}°C` },
          { icon: '💧', label: 'Humidity', value: `${humidity}%` },
          { icon: '🌧️', label: 'Rainfall', value: `${rainfall} mm` },
          { icon: '💨', label: 'Wind Speed', value: `${windSpeed} km/h` },
        ].map(({ icon, label, value }) => (
          <div key={label} className="glass-card-inner" style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1rem' }}>{icon}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* 7-Day Forecast */}
      {forecast.length > 0 && (
        <div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            7-Day Forecast
          </p>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {forecast.slice(0, 7).map((day, i) => (
              <div key={i} style={{
                flexShrink: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '4px', padding: '10px 14px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                minWidth: 56
              }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{day.day}</span>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon || '01d'}.png`}
                  alt=""
                  style={{ width: 32, height: 32 }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{day.temp}°</span>
                {day.rainfall > 0 && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--cyan-400, #22d3ee)' }}>
                    {day.rainfall}mm
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Impact on Soil */}
      <div style={{
        marginTop: '20px',
        padding: '14px 16px',
        background: 'rgba(0,230,118,0.06)',
        border: '1px solid rgba(0,230,118,0.2)',
        borderRadius: 'var(--radius-md)'
      }}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--green-primary)', marginBottom: '4px' }}>
          🌱 Weather Impact on Soil
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          {humidity > 75
            ? 'High humidity may increase fungal disease risk. Ensure proper drainage.'
            : humidity < 40
            ? 'Low humidity detected. Increase irrigation frequency to maintain soil moisture.'
            : 'Humidity levels are ideal for most crops. Maintain regular watering schedule.'}
          {rainfall > 10 ? ' Heavy rainfall expected — delay fertilizer application to prevent leaching.' : ''}
        </p>
      </div>
    </div>
  );
}
