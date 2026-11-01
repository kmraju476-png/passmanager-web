import React from 'react';
import { VaultItem, VaultCategory } from '../../types/vault';
import { CategoryBadge } from '../common/Badge';

export interface CategoryBreakdownProps {
  items: VaultItem[];
  onSelectCategory: (category: VaultCategory) => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  items,
  onSelectCategory,
}) => {
  const categories: VaultCategory[] = [
    'Banking',
    'Work',
    'Social Media',
    'Gaming',
    'Entertainment',
    'Shopping',
    'Other',
  ];

  const total = items.length || 1;

  const counts = categories.map((cat) => {
    const count = items.filter((i) => i.category === cat).length;
    const percentage = Math.round((count / total) * 100);
    return { category: cat, count, percentage };
  });

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Category Distribution</h3>
          <p className="text-xs text-slate-400">Vault accounts classified by domain</p>
        </div>
        <span className="text-xs text-blue-400 font-mono tabular-nums">{items.length} Total</span>
      </div>

      <div className="space-y-3">
        {counts.map(({ category, count, percentage }) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/40 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <CategoryBadge category={category} />
              <div className="w-24 sm:w-32 bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(5, percentage)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 group-hover:text-white">
              <span className="tabular-nums">{count}</span>
              <span className="text-slate-400">({percentage}%)</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
