import '@/styles/ui/section.css';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'dark';
  id?: string;
}

export default function Section({
  children,
  className = '',
  background = 'white',
  id,
}: SectionProps) {
  return (
    <section id={id} className={`section section-bg-${background} ${className}`}>
      <div className="container">
        {children}
      </div>
    </section>
  );
}
