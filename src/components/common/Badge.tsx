import React from 'react';
import { VaultCategory } from '../../types/vault';

export interface CategoryBadgeProps {
  category: VaultCategory;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className = '' }) => {
  // Clean unboxed or subtle hairline border style
  const categoryStyles: Record<VaultCategory, string> = {
    Banking: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    Work: 'text-blue-400 bg-blue-950/40 border-blue-500/30',
    'Social Media': 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
    Gaming: 'text-sky-400 bg-sky-950/40 border-sky-500/30',
    Entertainment: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30',
    Shopping: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    Other: 'text-slate-400 bg-slate-900/60 border-slate-700/40',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border tracking-wide ${categoryStyles[category] || categoryStyles.Other} ${className}`}
    >
      {category}
    </span>
  );
};
