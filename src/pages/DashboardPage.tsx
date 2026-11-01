import React, { useState } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentAccounts } from '../components/dashboard/RecentAccounts';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { KeyRound, Star, ShieldCheck, ShieldAlert, Search } from 'lucide-react';
import { VaultItem, VaultCategory } from '../types/vault';
import { securityService } from '../services/securityService';

export interface DashboardPageProps {
  items: VaultItem[];
  isAuthenticated: boolean;
  userName?: string;
  onNavigate: (page: string) => void;
  onEditItem: (item: VaultItem) => void;
  onCopyPassword: (password: string) => void;
  onCopyUsername: (username: string) => void;
  onSelectCategoryFilter: (category: VaultCategory) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  items,
  isAuthenticated,
  userName,
  onNavigate,
  onEditItem,
  onCopyPassword,
  onCopyUsername,
  onSelectCategoryFilter,
}) => {
  const [localSearch, setLocalSearch] = useState('');

  const favoritesCount = items.filter((i) => i.isFavorite).length;
  const securitySummary = securityService.getSummary(items);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      onNavigate('vault');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Global Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isAuthenticated ? (
              <>Welcome back, <span className="text-blue-400">{userName || 'there'}</span></>
            ) : (
              <>Welcome to <span className="text-blue-400">PassForge</span></>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAuthenticated
              ? 'Your PassForge vault is active. Master cryptographic keys derived in browser memory.'
              : 'Explore your security dashboard. Sign in or create an account to manage your vault.'}
          </p>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts, emails, sites..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-[#0a0f1d] text-slate-100 placeholder:text-slate-500 rounded-lg border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs pl-9 pr-4 py-2.5 outline-none transition-colors"
          />
        </form>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Credentials"
          value={items.length}
          subtitle="Saved in master vault"
          trend="+2 this month"
          icon={<KeyRound className="w-5 h-5" />}
          accentColor="blue"
          onClick={() => onNavigate('vault')}
        />
        <StatCard
          title="Favourites"
          value={favoritesCount}
          subtitle="Pinned quick access"
          icon={<Star className="w-5 h-5" />}
          accentColor="amber"
          onClick={() => onNavigate('vault')}
        />
        <StatCard
          title="Security Health"
          value={`${securitySummary.overallScore}%`}
          subtitle="Audit score status"
          trend={securitySummary.overallScore > 75 ? 'Optimal health' : 'Score requires review'}
          trendPositive={securitySummary.overallScore > 75}
          icon={<ShieldCheck className="w-5 h-5" />}
          accentColor="emerald"
          onClick={() => onNavigate('security')}
        />
        <StatCard
          title="Weak / Reused"
          value={securitySummary.weakCount + securitySummary.reusedCount}
          subtitle="Potential vulnerabilities"
          trend={`${securitySummary.weakCount} weak accounts`}
          trendPositive={false}
          icon={<ShieldAlert className="w-5 h-5" />}
          accentColor="indigo"
          onClick={() => onNavigate('security')}
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Quick Actions
          </h3>
          <span className="text-[11px] text-blue-400">Frequently used shortcuts</span>
        </div>
        <QuickActions onNavigate={onNavigate} />
      </div>

      {/* Two Column Grid: Recently Added Accounts + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <RecentAccounts
            items={items}
            onViewAll={() => onNavigate('vault')}
            onEdit={onEditItem}
            onCopyPassword={onCopyPassword}
            onCopyUsername={onCopyUsername}
          />
        </div>

        <div>
          <CategoryBreakdown
            items={items}
            onSelectCategory={(cat) => {
              onSelectCategoryFilter(cat);
              onNavigate('vault');
            }}
          />
        </div>
      </div>
    </div>
  );
};
