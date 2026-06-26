import type { ReactNode, MouseEventHandler } from 'react';
import { AnimatedButton } from './AnimatedButton';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button(props: ButtonProps) {
  return <AnimatedButton {...props} />;
}
