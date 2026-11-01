import React from 'react';
import { Shield } from 'lucide-react';

export interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/60 bg-[#020408] py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-blue-600/30 border border-blue-500/30 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <span className="font-bold text-slate-300">PassForge</span>
            <span className="mx-2">·</span>
            <span>Your Passwords. Your Control.</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate('landing')}
                className="hover:text-slate-300 transition-colors"
              >
                Overview
              </button>
              <button
                onClick={() => onNavigate('vault')}
                className="hover:text-slate-300 transition-colors"
              >
                Vault
              </button>
              <button
                onClick={() => onNavigate('generator')}
                className="hover:text-slate-300 transition-colors"
              >
                Generator
              </button>
              <button
                onClick={() => onNavigate('security')}
                className="hover:text-slate-300 transition-colors"
              >
                Security Center
              </button>
              <button
                onClick={() => onNavigate('settings')}
                className="hover:text-slate-300 transition-colors"
              >
                Settings
              </button>
            </>
          )}
        </div>

        <div className="text-right text-[11px] text-slate-400">
          © 2026 PassForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
