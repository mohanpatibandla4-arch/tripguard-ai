import { Link, type LinkProps } from 'react-router-dom';
import type { ReactNode } from 'react';

interface LinkButtonProps extends Omit<LinkProps, 'className'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
}

const variants = {
  primary:
    'bg-gradient-to-r from-eu-blue to-eu-blue-light text-white shadow-lg shadow-eu-blue/25 hover:shadow-eu-blue/40',
  secondary: 'bg-white hover:bg-muted text-eu-navy ring-1 ring-border',
  ghost: 'bg-transparent hover:bg-eu-blue/5 text-eu-navy',
  outline: 'bg-transparent hover:bg-eu-yellow-soft text-eu-blue ring-2 ring-eu-blue/30',
  ai: 'bg-white text-eu-navy ring-2 ring-eu-yellow shadow-md hover:shadow-lg',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-2xl',
};

export function LinkButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 font-semibold transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
