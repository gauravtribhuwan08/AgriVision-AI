import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Home', icon: '🏠', exact: true },
  { to: '/detect', label: 'Detect Disease', icon: '🔬' },
  { to: '/soil', label: 'Soil Dashboard', icon: '🛰️' },
  { to: '/chat', label: 'AgriBot Chat', icon: '💬' },
  { to: '/history', label: 'History', icon: '📋' },
  { to: '/about', label: 'About', icon: 'ℹ️' },
];

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">🌱</div>
            <span className="logo-text">Agri<span>Vision</span> AI</span>
          </Link>

          <ul className="navbar-nav">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <div className="nav-link" style={{ color: 'var(--green-primary)', fontWeight: 600 }}>
                    👤 {user.name}
                  </div>
                </li>
                <li>
                  <button onClick={handleLogout} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    🚪 Logout
                  </button>
                </li>
                <li>
                  <NavLink to="/detect" className="nav-link nav-cta btn">
                    🔬 Analyze Leaf
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <NavLink to="/auth" className="nav-link nav-cta btn">
                  🔐 Sign In
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
