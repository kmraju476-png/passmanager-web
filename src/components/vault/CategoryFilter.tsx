import React from 'react';
import { VaultCategory } from '../../types/vault';

export interface CategoryFilterProps {
  selectedCategory: VaultCategory | 'All';
  onSelectCategory: (category: VaultCategory | 'All') => void;
  categoryCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const categories: Array<VaultCategory | 'All'> = [
    'All',
    'Banking',
    'Work',
    'Social Media',
    'Gaming',
    'Entertainment',
    'Shopping',
    'Other',
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count = categoryCounts[cat] || 0;

        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isSelected
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-[#060913] text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <span>{cat}</span>
            <span
              className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-900 text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
