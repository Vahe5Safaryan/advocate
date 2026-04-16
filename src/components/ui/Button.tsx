import Link from 'next/link';
import '@/styles/ui/button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'gold' | 'outline' | 'outline-white';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  target?: string;
}

export default function Button({
  children,
  variant = 'gold',
  href,
  onClick,
  type = 'button',
  className = '',
  target,
}: ButtonProps) {
  const baseClass = `btn btn-${variant} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClass} target={target}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClass}>
      {children}
    </button>
  );
}
