'use client';

import { useEffect, useState, useRef } from 'react';
import { Section } from '@/components/ui';
import '@/styles/statistics.css';

const stats = [
  { number: 500, suffix: '+', label: 'Успешных дел' },
  { number: 10, suffix: '+', label: 'Лет опыта' },
  { number: 15, suffix: '', label: 'Опытных юристов' },
  { number: 98, suffix: '%', label: 'Довольных клиентов' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <div ref={ref} className="statistics-number">
      {count}{suffix}
    </div>
  );
}

export default function Statistics() {
  return (
    <Section background="dark" className="statistics-section">
      <div className="statistics-grid">
        {stats.map((stat, index) => (
          <div key={index} className="statistics-item">
            <Counter target={stat.number} suffix={stat.suffix} />
            <p className="statistics-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
