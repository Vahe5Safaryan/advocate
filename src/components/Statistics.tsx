'use client';

import { useEffect, useState, useRef } from 'react';
import { Section } from '@/components/ui';
import '@/styles/statistics.css';

interface StatItem {
  id: string;
  number: number;
  suffix: string;
  label: string;
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <div ref={ref} className="statistics-number">
      {count}{suffix}
    </div>
  );
}

export default function Statistics({ stats = [] }: { stats?: StatItem[] }) {
  const data = stats;
  if (data.length === 0) return null;

  return (
    <Section background="dark" className="statistics-section">
      <div className="statistics-grid">
        {data.map((stat) => (
          <div key={stat.id} className="statistics-item">
            <Counter target={stat.number} suffix={stat.suffix} />
            <p className="statistics-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
