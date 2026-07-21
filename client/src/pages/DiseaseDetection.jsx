import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import ImageUploader from '../components/ImageUploader';
import DiagnosisCard from '../components/DiagnosisCard';
import Loader from '../components/Loader';
import { diagnoseLeaf, getDiagnosisHistory } from '../utils/api';
import { useEffect } from 'react';

const SAMPLE_CROPS = [
  { icon: '🍅', name: 'Tomato' },
  { icon: '🥔', name: 'Potato' },
  { icon: '🌽', name: 'Corn' },
  { icon: '🍇', name: 'Grape' },
  { icon: '🍎', name: 'Apple' },
  { icon: '🌾', name: 'Rice' },
];

export default function DiseaseDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await getDiagnosisHistory();
      setRecentHistory(res.data.data?.slice(0, 5) || []);
    } catch {
      // DB might not be connected — ok
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleImageSelected = useCallback((file) => {
    setSelectedFile(file);
    if (!file) setResult(null);
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please upload a leaf image first!');
      return;
    }

    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await diagnoseLeaf(formData);
      setResult(response.data.data);
      toast.success('✅ Analysis complete!');
      fetchHistory();
    } catch (error) {
      const msg = error.response?.data?.message || 'Analysis failed. Is the server running?';
      toast.error(`❌ ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityBadgeClass = (sev) => {
    const map = { None: 'green', Low: 'green', Medium: 'amber', High: 'orange', Critical: 'red' };
    return `badge badge-${map[sev] || 'gray'}`;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <div className="page-badge">🔬 Computer Vision AI</div>
              <h1>Crop Disease <span className="gradient-text">Detection</span></h1>
              <p style={{ maxWidth: 520, marginTop: '12px' }}>
                Upload a leaf image from your smartphone. Our AI model diagnoses diseases,
                identifies pathogen types, and recommends organic treatments.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {SAMPLE_CROPS.map(c => (
                <div key={c.name} className="glass-card-inner" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', cursor: 'default' }}>
                  {c.icon} {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="info-alert" style={{ marginBottom: '32px' }}>
          <span className="info-alert-icon">💡</span>
          <div>
            <strong style={{ color: 'var(--green-primary)' }}>Pro Tip:</strong> For best results, take a close-up photo of a single diseased leaf in good lighting. Avoid blurry or backlit images.
            Our model supports <strong>tomato, potato, corn, rice, grape, and apple</strong> leaves.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }}>
          {/* Left: Upload Panel */}
          <div>
            <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📷 Upload Leaf Image
              </h3>
              <ImageUploader onImageSelected={handleImageSelected} isLoading={isLoading} />

              <div style={{ marginTop: '20px' }}>
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isLoading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isLoading ? (
                    <>
                      <div className="loader-ring" style={{ width: 20, height: 20, borderWidth: 2 }} />
                      Analyzing...
                    </>
                  ) : '🔬 Analyze for Disease'}
                </button>
              </div>
            </div>

            {/* How it Works mini */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h4 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                How It Works
              </h4>
              {[
                { step: '1', text: 'Upload a clear leaf photo' },
                { step: '2', text: 'CNN model extracts visual features' },
                { step: '3', text: 'Disease classified from 38 categories' },
                { step: '4', text: 'Organic treatments recommended' },
              ].map(({ step, text }) => (
                <div key={step} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <div className="step-number" style={{ width: 28, height: 28, fontSize: '0.75rem', flexShrink: 0 }}>{step}</div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Results Panel */}
          <div>
            {isLoading ? (
              <div className="glass-card" style={{ padding: '40px' }}>
                <Loader text="Computer vision model analyzing leaf patterns..." size="lg" />
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Extracting visual features · Classifying disease · Generating treatment plan
                  </p>
                </div>
              </div>
            ) : result ? (
              <DiagnosisCard data={result} />
            ) : (
              <div className="glass-card" style={{ padding: '60px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>🍃</div>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 500 }}>
                  Awaiting Analysis
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Upload a leaf image and click "Analyze for Disease" to see the AI diagnosis results here.
                </p>
              </div>
            )}

            {/* Recent History */}
            {recentHistory.length > 0 && (
              <div className="glass-card" style={{ padding: '24px', marginTop: '20px' }}>
                <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📋 Recent Diagnoses
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recentHistory.map((item) => (
                    <div key={item._id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--glass-border)', gap: '12px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {item.cropType} — {item.diseaseName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={getSeverityBadgeClass(item.severity)}>
                        {item.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
