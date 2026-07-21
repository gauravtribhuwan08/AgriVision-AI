export default function Loader({ text = 'Analyzing...', size = 'md' }) {
  const ringSize = size === 'lg' ? 80 : size === 'sm' ? 40 : 60;

  return (
    <div className="loader-container">
      <div
        className="loader-ring"
        style={{ width: ringSize, height: ringSize }}
      />
      <div className="loader-dots">
        <div className="loader-dot" />
        <div className="loader-dot" />
        <div className="loader-dot" />
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
}
