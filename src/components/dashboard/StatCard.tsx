import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  accentColor?: 'blue' | 'emerald' | 'amber' | 'cyan' | 'indigo';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
  accentColor = 'blue',
  onClick,
}) => {
  const accentBorder = {
    blue: 'border-blue-500/20 hover:border-blue-500/40',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40',
    amber: 'border-amber-500/20 hover:border-amber-500/40',
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40',
    indigo: 'border-indigo-500/20 hover:border-indigo-500/40',
  }[accentColor] || 'border-blue-500/20 hover:border-blue-500/40';

  const iconBg = {
    blue: 'bg-blue-950/60 text-blue-400 border-blue-500/30',
    emerald: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-500/30',
    cyan: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30',
    indigo: 'bg-indigo-950/60 text-indigo-400 border-indigo-500/30',
  }[accentColor] || 'bg-blue-950/60 text-blue-400 border-blue-500/30';

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-5 rounded-xl border transition-all duration-200 ${accentBorder} ${
        onClick ? 'cursor-pointer hover:translate-y-[-2px]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2 tabular-nums font-mono">
            {value}
          </div>
        </div>
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
          <span>{subtitle}</span>
          {trend && (
            <span
              className={`font-medium ${trendPositive ? 'text-emerald-400' : 'text-amber-400'}`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
