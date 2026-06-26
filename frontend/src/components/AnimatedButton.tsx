import { motion } from 'framer-motion';
import type { ReactNode, MouseEventHandler } from 'react';

interface AnimatedButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const variants = {
  primary:
    'bg-gradient-to-r from-eu-blue to-eu-blue-light text-white shadow-lg shadow-eu-blue/25 hover:shadow-eu-blue/40 disabled:opacity-60',
  secondary:
    'bg-white hover:bg-muted text-eu-navy ring-1 ring-border disabled:opacity-60',
  ghost: 'bg-transparent hover:bg-eu-blue/5 text-eu-navy disabled:opacity-60',
  outline:
    'bg-transparent hover:bg-eu-yellow-soft text-eu-blue ring-2 ring-eu-blue/30 disabled:opacity-60',
  ai: 'bg-white text-eu-navy ring-2 ring-eu-yellow shadow-md hover:shadow-lg hover:ring-eu-red/40 disabled:opacity-60',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-2xl',
};

export function AnimatedButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  type = 'button',
  onClick,
}: AnimatedButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={disabled ? undefined : { scale: 1.04, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden font-semibold transition-shadow ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
    >
      <motion.span
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.5 }}
      />
      <span className="relative">{children}</span>
    </motion.button>
  );
}
