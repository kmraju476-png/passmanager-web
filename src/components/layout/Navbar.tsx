import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { Button } from '../common/Button';

export interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#030712]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white block leading-none">
              Pass<span className="text-blue-400">Forge</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider block mt-0.5">
              SECURITY DASHBOARD
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('landing')}
            className={`hover:text-blue-300 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              currentPage === 'landing' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`hover:text-blue-300 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              currentPage === 'dashboard' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('vault')}
            className={`hover:text-blue-300 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              currentPage === 'vault' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            My Vault
          </button>
          <button
            onClick={() => onNavigate('generator')}
            className={`hover:text-blue-300 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              currentPage === 'generator' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Generator
          </button>
          <button
            onClick={() => onNavigate('security')}
            className={`hover:text-blue-300 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              currentPage === 'security' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Security Center
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onNavigate('login')}
            className="hidden sm:inline-flex text-slate-300 hover:text-white"
          >
            Log In
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Lock className="w-3.5 h-3.5" />}
            onClick={() => onNavigate('dashboard')}
          >
            Open Dashboard
          </Button>
        </div>
      </div>
    </header>
  );
};
