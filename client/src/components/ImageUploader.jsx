import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImageUploader({ onImageSelected, isLoading }) {
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    onImageSelected(file);
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] },
    maxFiles: 1,
    disabled: isLoading,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelected(null);
  };

  return (
    <div>
      {!preview ? (
        <div
          {...getRootProps()}
          className={`upload-zone ${isDragActive ? 'drag-active' : ''}`}
        >
          <input {...getInputProps()} />
          <span className="upload-icon">📷</span>
          {isDragActive ? (
            <>
              <h3 style={{ color: 'var(--green-primary)', marginBottom: '8px' }}>Drop your leaf image here!</h3>
              <p style={{ fontSize: '0.9rem' }}>Release to analyze</p>
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: '12px' }}>Upload Leaf Image</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
                Drag & drop a leaf photo, or click to browse
              </p>
              <div className="btn btn-primary">
                📁 Browse Files
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px' }}>
                Supports JPEG, PNG, WebP · Max 10MB
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="upload-preview">
          <img src={preview} alt="Leaf preview" />
          {isLoading && <div className="scan-line" />}
          {!isLoading && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              display: 'flex', gap: '8px'
            }}>
              <button
                onClick={handleRemove}
                className="btn btn-sm btn-secondary"
                style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
              >
                🗑️ Remove
              </button>
            </div>
          )}
          {isLoading && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '16px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              textAlign: 'center'
            }}>
              <p style={{ color: 'var(--green-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                🔬 AI is analyzing your leaf...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
