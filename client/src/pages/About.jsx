import { Link } from 'react-router-dom';

const TEAM = [
  {
    name: 'Gaurav Tribhuwan',
    role: 'AI & Computer Vision',
    bio: 'Specializes in machine learning, convolutional neural networks, and agricultural AI applications.',
    icon: '🧑‍💻',
    skills: ['Python', 'TensorFlow', 'OpenCV', 'YOLOv8'],
    color: 'var(--green-primary)',
  },
  {
    name: 'Vedant Deshmukh',
    role: 'Full Stack & GIS',
    bio: 'Expert in React.js, Node.js, MongoDB, and geospatial data visualization for precision agriculture.',
    icon: '👨‍💻',
    skills: ['React', 'Node.js', 'MongoDB', 'Leaflet'],
    color: 'var(--teal-400)',
  },
];

const TECH_STACK = [
  { category: 'Frontend', items: ['React 18', 'Vite', 'Leaflet.js', 'Recharts', 'React Dropzone'], icon: '⚛️' },
  { category: 'Backend', items: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Multer'], icon: '🖥️' },
  { category: 'AI / ML', items: ['Computer Vision CNN', 'Soil Nutrient ML Model', 'Predictive Analytics', 'YOLOv8 (roadmap)'], icon: '🤖' },
  { category: 'Data Sources', items: ['Satellite Telemetry', 'OpenWeatherMap API', 'NDVI Index', 'Historical Soil Data'], icon: '🛰️' },
];

const PROBLEM_PROMPTS = [
  {
    icon: '🔬',
    title: 'Computer Vision Crop Disease Detection',
    description: 'Build a computer-vision powered crop disease detection system that analyzes smartphone leaf images, diagnoses pathogen types, and recommends organic pest control options.',
    solution: 'Disease Detection Page',
    solutionLink: '/detect',
  },
  {
    icon: '🛰️',
    title: 'Predictive Soil Nutrient Mapping',
    description: 'Create a predictive soil nutrient mapping dashboard that leverages satellite telemetry and local weather patterns to optimize fertilizer delivery schedules.',
    solution: 'Soil Dashboard',
    solutionLink: '/soil',
  },
];

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div>
            <div className="page-badge">ℹ️ About the Project</div>
            <h1>About <span className="gradient-text">AgriVision AI</span></h1>
            <p style={{ maxWidth: 560, marginTop: '12px' }}>
              An integrated AI platform built for the hackathon that addresses both agricultural challenges
              in one unified solution.
            </p>
          </div>
        </div>

        {/* Problem Statements */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-8)' }}>
            <div className="section-eyebrow">🏆 Hackathon Challenge</div>
            <h2>Problem Statements We Solved</h2>
          </div>
          <div className="grid-2">
            {PROBLEM_PROMPTS.map((p, i) => (
              <div key={i} className="glass-card" style={{ padding: '32px', borderLeft: '3px solid var(--green-primary)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{p.icon}</div>
                <h3 style={{ marginBottom: '12px' }}>{p.title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '20px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  "{p.description}"
                </p>
                <Link to={p.solutionLink} className="btn btn-primary btn-sm">
                  ✅ View Our Solution: {p.solution}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-8)' }}>
            <div className="section-eyebrow">👥 Our Team</div>
            <h2>Team <span className="gradient-text">Techno_VG</span></h2>
          </div>
          <div className="grid-2">
            {TEAM.map((member, i) => (
              <div key={member.name} className="glass-card animate-fadeInUp" style={{
                padding: '36px',
                animationDelay: `${i * 150}ms`,
                opacity: 0,
                animationFillMode: 'forwards',
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${member.color}22, ${member.color}44)`,
                  border: `2px solid ${member.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', marginBottom: '20px',
                  boxShadow: `0 0 30px ${member.color}22`
                }}>
                  {member.icon}
                </div>
                <h3 style={{ marginBottom: '6px', color: member.color }}>{member.name}</h3>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {member.role}
                </p>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '20px' }}>{member.bio}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {member.skills.map(s => (
                    <span key={s} className="badge badge-gray">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ padding: '24px', marginTop: '20px', textAlign: 'center', borderTop: '2px solid var(--green-primary)' }}>
            <p style={{ fontSize: '1.0625rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              "Our goal is to leverage Artificial Intelligence and Computer Vision to help farmers improve crop health,
              reduce fertilizer waste, and increase agricultural productivity."
            </p>
            <span className="badge badge-green">Team Techno_VG · Hackathon 2024</span>
          </div>
        </section>

        {/* Tech Stack */}
        <section style={{ marginBottom: 'var(--space-16)' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-8)' }}>
            <div className="section-eyebrow">🛠️ Technology</div>
            <h2>Tech <span className="gradient-text">Stack</span></h2>
          </div>
          <div className="grid-4">
            {TECH_STACK.map((cat, i) => (
              <div key={cat.category} className="glass-card animate-fadeInUp" style={{
                padding: '28px',
                animationDelay: `${i * 100}ms`,
                opacity: 0,
                animationFillMode: 'forwards'
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-lg)',
                  background: 'var(--green-glow)', border: '1px solid var(--glass-border-green)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', marginBottom: '16px'
                }}>
                  {cat.icon}
                </div>
                <h4 style={{ marginBottom: '12px', color: 'var(--green-primary)' }}>{cat.category}</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cat.items.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-primary)', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Impact */}
        <section>
          <div className="glass-card" style={{ padding: '48px 40px', background: 'linear-gradient(135deg, rgba(0,230,118,0.04), rgba(20,184,166,0.04))' }}>
            <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
              <div className="section-eyebrow">🌍 Expected Impact</div>
              <h2>Why <span className="gradient-text">AgriVision AI?</span></h2>
            </div>
            <div className="grid-3" style={{ marginBottom: '32px' }}>
              {[
                { icon: '🌿', title: 'Reduce Fertilizer Waste', desc: 'Precision soil mapping eliminates over-application by up to 30%' },
                { icon: '📈', title: 'Increase Crop Yield', desc: 'Early disease detection can prevent 20-40% yield losses' },
                { icon: '♻️', title: 'Promote Organic Farming', desc: 'All treatments recommended are certified organic and eco-friendly' },
                { icon: '💰', title: 'Lower Farming Costs', desc: 'Targeted fertilizer application reduces input costs significantly' },
                { icon: '🌱', title: 'Environmental Protection', desc: 'Reduces chemical runoff and soil degradation' },
                { icon: '👨‍🌾', title: 'Improve Farmer Income', desc: 'Better yields + lower costs = higher profitability per acre' },
              ].map((item, i) => (
                <div key={item.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)',
                    background: 'var(--green-glow)', border: '1px solid var(--glass-border-green)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '6px', fontSize: '1rem' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.8375rem', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link to="/detect" className="btn btn-primary btn-lg" style={{ marginRight: '16px' }}>
                🔬 Try Disease Detection
              </Link>
              <Link to="/soil" className="btn btn-outline btn-lg">
                🛰️ Try Soil Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
