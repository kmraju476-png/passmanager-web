import React, { useState } from 'react';
import { VaultItem, VaultCategory, VaultSortOption } from '../types/vault';
import { CredentialCard } from '../components/vault/CredentialCard';
import { CategoryFilter } from '../components/vault/CategoryFilter';
import { CredentialDetailModal } from '../components/vault/CredentialDetailModal';
import { Search, Plus, Star, ArrowUpDown, FilterX } from 'lucide-react';

export interface VaultPageProps {
  items: VaultItem[];
  filteredItems: VaultItem[];
  searchQuery: string;
  selectedCategory: VaultCategory | 'All';
  onlyFavorites: boolean;
  sortOption: VaultSortOption;
  onSearchChange: (q: string) => void;
  onCategoryChange: (cat: VaultCategory | 'All') => void;
  onToggleFavoritesFilter: () => void;
  onSortChange: (sort: VaultSortOption) => void;
  onNavigate: (page: string) => void;
  onEditItem: (item: VaultItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCopyPassword: (password: string) => void;
  onCopyUsername: (username: string) => void;
}

export const VaultPage: React.FC<VaultPageProps> = ({
  items,
  filteredItems,
  searchQuery,
  selectedCategory,
  onlyFavorites,
  sortOption,
  onSearchChange,
  onCategoryChange,
  onToggleFavoritesFilter,
  onSortChange,
  onNavigate,
  onEditItem,
  onDeleteItem,
  onToggleFavorite,
  onCopyPassword,
  onCopyUsername,
}) => {
  const [detailModalItem, setDetailModalItem] = useState<VaultItem | null>(null);

  const categoryCounts = items.reduce<Record<string, number>>(
    (acc, item) => {
      acc['All'] = (acc['All'] || 0) + 1;
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    { All: 0 }
  );

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Top Header: Title & Add Action */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Credential Vault</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {items.length} accounts saved
          </p>
        </div>

        <button
          onClick={() => onNavigate('add-password')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Password</span>
        </button>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={onCategoryChange}
        categoryCounts={categoryCounts}
      />

      {/* Search & Sort Bar */}
      <div className="bg-[#070b16] p-2.5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts or websites..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#04060c] text-slate-100 placeholder:text-slate-500 rounded-lg border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs pl-8 pr-3 py-1.5 outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onToggleFavoritesFilter}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              onlyFavorites
                ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                : 'bg-[#04060c] text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
            aria-label="Filter favorites"
          >
            <Star
              className={`w-3 h-3 ${
                onlyFavorites ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
              }`}
            />
            <span>Favorites</span>
          </button>

          <div className="flex items-center gap-1.5 bg-[#04060c] px-2.5 py-1 rounded-lg border border-slate-800 text-xs text-slate-400">
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as VaultSortOption)}
              className="bg-transparent text-slate-300 text-xs outline-none cursor-pointer"
            >
              <option value="updated-desc" className="bg-[#070b16] text-white">Recently Updated</option>
              <option value="created-desc" className="bg-[#070b16] text-white">Date Created</option>
              <option value="title-asc" className="bg-[#070b16] text-white">Name (A-Z)</option>
              <option value="title-desc" className="bg-[#070b16] text-white">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of clean credential cards */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => (
            <CredentialCard
              key={item.id}
              item={item}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              onToggleFavorite={onToggleFavorite}
              onCopyPassword={onCopyPassword}
              onCopyUsername={onCopyUsername}
              onViewDetails={(item) => setDetailModalItem(item)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#070b16] p-10 rounded-xl border border-slate-800 text-center max-w-sm mx-auto my-6">
          <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-3">
            <FilterX className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">No accounts found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Try adjusting your search query or category filter.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              onCategoryChange('All');
              if (onlyFavorites) onToggleFavoritesFilter();
            }}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <CredentialDetailModal
        item={detailModalItem}
        isOpen={Boolean(detailModalItem)}
        onClose={() => setDetailModalItem(null)}
        onEdit={(item) => {
          setDetailModalItem(null);
          onEditItem(item);
        }}
        onToggleFavorite={onToggleFavorite}
        onCopyPassword={onCopyPassword}
        onCopyUsername={onCopyUsername}
      />
    </div>
  );
};
