import React from 'react';
import { Menu, Plus, Search, Lock } from 'lucide-react';
import { Button } from '../common/Button';

export interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSignOut?: () => void;
  onOpenMobileMenu?: () => void;
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onSignOut,
  onOpenMobileMenu,
  onSearchClick,
}) => {
  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Security Dashboard', subtitle: 'Overview of your protected accounts' },
    vault: { title: 'Credential Vault', subtitle: 'Manage passwords, tokens, and notes' },
    'add-password': { title: 'Add New Credential', subtitle: 'Save an encrypted entry' },
    'edit-password': { title: 'Edit Credential', subtitle: 'Update account credentials' },
    generator: { title: 'Password Generator', subtitle: 'Cryptographic Web Crypto generator' },
    security: { title: 'Security Center', subtitle: 'Audits, health scores, and weak passwords' },
    settings: { title: 'Preferences & Security', subtitle: 'Application behavior and auto-lock' },
    profile: { title: 'User Account Profile', subtitle: 'Master key settings and session keys' },
  };

  const current = pageTitles[currentPage] || { title: 'PassForge', subtitle: 'Vault' };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#030712]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + breadcrumb title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="hidden sm:inline">PassForge</span>
              <span className="hidden sm:inline" aria-hidden="true">/</span>
              <span className="text-blue-400 font-semibold truncate">{current.title}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
              {current.title}
            </h1>
          </div>
        </div>

        {/* Right: Quick actions + User profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Search passwords"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search vault...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                /
              </kbd>
            </button>
          )}

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => onNavigate('add-password')}
            className="shadow-sm"
          >
            <span className="hidden sm:inline">Add Password</span>
            <span className="sm:hidden">Add</span>
          </Button>

          <button
            onClick={() => (onSignOut ? onSignOut() : onNavigate('login'))}
            className="p-2 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-950/20 border border-slate-800 transition-colors"
            title="Lock Vault"
            aria-label="Lock Vault"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
