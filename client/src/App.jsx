import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import DiseaseDetection from './pages/DiseaseDetection';
import SoilDashboard from './pages/SoilDashboard';
import History from './pages/History';
import About from './pages/About';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import FloatingChatbot from './components/FloatingChatbot';
import { AuthProvider, AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/detect" element={
                <ProtectedRoute>
                  <DiseaseDetection />
                </ProtectedRoute>
              } />
              <Route path="/soil" element={
                <ProtectedRoute>
                  <SoilDashboard />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<About />} />
              {/* 404 fallback */}
            <Route path="*" element={
              <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🌿</div>
                  <h2 style={{ marginBottom: '12px' }}>Page Not Found</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>The page you are looking for does not exist.</p>
                  <a href="/" className="btn btn-primary">🏠 Go Home</a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
        <FloatingChatbot />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
      </BrowserRouter>
    </AuthProvider>
  );
}
