import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ChatCard } from '../types';

export function ChatRouteCard({ card, index }: { card: ChatCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link
        to={card.actionUrl}
        className="group flex overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:border-eu-blue/40 hover:shadow-md"
      >
        <div
          className="h-16 w-20 shrink-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${card.imageUrl})` }}
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2">
          <p className="truncate text-sm font-semibold text-eu-navy">{card.title}</p>
          <p className="truncate text-xs text-ink-muted">{card.subtitle}</p>
        </div>
        <span className="flex items-center pr-3 text-eu-blue opacity-0 transition group-hover:opacity-100">
          →
        </span>
      </Link>
    </motion.div>
  );
}
