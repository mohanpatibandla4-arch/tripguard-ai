import type { ReactNode } from 'react';
import { LinkButton } from './LinkButton';
import { AnimatedButton } from './AnimatedButton';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
        {icon ?? '✈️'}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{description}</p>
      {actionLabel && actionTo ? (
        <LinkButton to={actionTo} className="mt-6">
          {actionLabel}
        </LinkButton>
      ) : null}
      {actionLabel && onAction ? (
        <AnimatedButton className="mt-6" onClick={onAction}>
          {actionLabel}
        </AnimatedButton>
      ) : null}
    </div>
  );
}
