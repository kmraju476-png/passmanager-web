import React from 'react';
import { Plus, Sparkles, ShieldAlert, KeyRound } from 'lucide-react';

export interface QuickActionsProps {
  onNavigate: (page: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    {
      label: 'Add Password',
      description: 'Create & store entry',
      icon: <Plus className="w-5 h-5 text-blue-400" />,
      onClick: () => onNavigate('add-password'),
      highlight: true,
    },
    {
      label: 'Generate Password',
      description: 'Web Crypto generator',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      onClick: () => onNavigate('generator'),
    },
    {
      label: 'Security Audit',
      description: 'Analyze password health',
      icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
      onClick: () => onNavigate('security'),
    },
    {
      label: 'Browse Vault',
      description: 'Filter all credentials',
      icon: <KeyRound className="w-5 h-5 text-emerald-400" />,
      onClick: () => onNavigate('vault'),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((act) => (
        <button
          key={act.label}
          onClick={act.onClick}
          className={`glass-panel p-4 rounded-xl border text-left transition-all duration-200 hover:border-blue-500/40 hover:translate-y-[-2px] group cursor-pointer ${
            act.highlight ? 'border-blue-500/30 bg-blue-950/20' : 'border-slate-800'
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
            {act.icon}
          </div>
          <div className="text-sm font-semibold text-white tracking-tight leading-snug">
            {act.label}
          </div>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{act.description}</p>
        </button>
      ))}
    </div>
  );
};
