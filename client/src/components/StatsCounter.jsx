import { useEffect, useRef, useState } from 'react';

export default function StatsCounter({ value, suffix = '', prefix = '', label, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCount = () => {
    const numericValue = parseFloat(value);
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * numericValue);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const formatCount = (n) => {
    const num = typeof value === 'string' && value.includes('.') ? n.toFixed(1) : Math.floor(n);
    return num.toLocaleString();
  };

  return (
    <div ref={ref} className="stat-counter">
      <div className="stat-number">
        {prefix}{formatCount(count)}{suffix}
      </div>
      <p className="stat-label">{label}</p>
    </div>
  );
}
