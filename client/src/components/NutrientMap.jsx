import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Convert health score to color for heatmap
function scoreToColor(score) {
  if (score >= 80) return '#00e676';
  if (score >= 60) return '#a3e635';
  if (score >= 40) return '#facc15';
  if (score >= 20) return '#f97316';
  return '#ef4444';
}

export default function NutrientMap({ location, mapData, soilHealthScore }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const circlesRef = useRef([]);

  useEffect(() => {
    if (!location || mapInstanceRef.current) return;

    const { lat, lon } = location;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [lat, lon],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CartoDB',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location]);

  // Add grid circles whenever mapData changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapData?.gridPoints) return;

    // Remove old circles
    circlesRef.current.forEach(c => map.removeLayer(c));
    circlesRef.current = [];

    // Draw nutrient heatmap circles
    mapData.gridPoints.forEach(point => {
      const color = scoreToColor(point.healthScore);
      const circle = L.circleMarker([point.lat, point.lon], {
        radius: 14,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.55,
      }).addTo(map);

      circle.bindPopup(`
        <div style="font-family: var(--font-body);">
          <strong style="color: ${color}">Soil Health: ${point.healthScore}%</strong><br/>
          <small>N: ${point.nitrogen?.toFixed(0)} | P: ${point.phosphorus?.toFixed(0)} | K: ${point.potassium?.toFixed(0)} kg/ha</small>
        </div>
      `);

      circlesRef.current.push(circle);
    });

    // Main location marker with pulsing effect
    const markerHtml = `
      <div style="
        width: 40px; height: 40px;
        background: var(--gradient-green, linear-gradient(135deg, #00e676, #14b8a6));
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 20px rgba(0,230,118,0.5);
        display: flex; align-items: center; justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 16px;">📍</span>
      </div>
    `;

    const icon = L.divIcon({
      html: markerHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      className: ''
    });

    const mainMarker = L.marker([location.lat, location.lon], { icon }).addTo(map);
    mainMarker.bindPopup(`
      <div>
        <strong>${location.name || 'Farm Location'}</strong><br/>
        <span style="color: #00e676;">Soil Health Score: ${soilHealthScore}%</span>
      </div>
    `).openPopup();

    circlesRef.current.push(mainMarker);

    // Fit bounds to show all grid points
    if (mapData.bounds) {
      const { north, south, east, west } = mapData.bounds;
      map.fitBounds([[south, west], [north, east]], { padding: [20, 20] });
    }
  }, [mapData, location, soilHealthScore]);

  return (
    <div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {[
          { color: '#00e676', label: 'Excellent (80–100)' },
          { color: '#a3e635', label: 'Good (60–79)' },
          { color: '#facc15', label: 'Fair (40–59)' },
          { color: '#f97316', label: 'Poor (20–39)' },
          { color: '#ef4444', label: 'Critical (<20)' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{ height: 420, borderRadius: 'var(--radius-xl)', overflow: 'hidden', zIndex: 0 }}
      />
    </div>
  );
}
