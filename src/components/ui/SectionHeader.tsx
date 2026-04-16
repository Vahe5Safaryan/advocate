import '@/styles/ui/section-header.css';

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  subtitle,
  title,
  description,
  centered = true,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`section-header ${centered ? 'centered' : ''} ${className}`}>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      <h2 className="section-title">{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
