import React from 'react';
import {
  LayoutDashboard,
  Shield,
  KeyRound,
  PlusCircle,
  ShieldAlert,
  Settings,
  User,
  Home,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';

export interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSignOut?: () => void;
  vaultCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onSignOut,
  vaultCount = 10,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const mainNav = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'vault',
      label: 'My Vault',
      icon: <KeyRound className="w-4 h-4" />,
      count: vaultCount,
    },
    {
      id: 'add-password',
      label: 'Add Password',
      icon: <PlusCircle className="w-4 h-4" />,
    },
    {
      id: 'generator',
      label: 'Password Generator',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'security',
      label: 'Security Center',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  const content = (
    <aside className="w-64 h-full flex flex-col justify-between bg-[#060913] border-r border-slate-800/80 p-4 select-none">
      {/* Brand header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-1">
          <button
            onClick={() => {
              onNavigate('landing');
              onCloseMobile?.();
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">PassForge</span>
            </div>
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Navigation
          </p>
          {mainNav.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-200 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="text-xs font-mono tabular-nums px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer controls & developer reference */}
      <div className="space-y-2 pt-4 border-t border-slate-800/80">
        <button
          onClick={() => {
            onNavigate('landing');
            onCloseMobile?.();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
        >
          <Home className="w-4 h-4 text-slate-400" />
          <span>Landing Page</span>
        </button>
        <button
          onClick={() => {
            if (onSignOut) {
              onSignOut();
            } else {
              onNavigate('login');
            }
            onCloseMobile?.();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Lock / Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0">{content}</div>

      {/* Mobile drawer overlay */}
      {isOpenMobile && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-64 max-w-xs">{content}</div>
        </div>
      )}
    </>
  );
};
