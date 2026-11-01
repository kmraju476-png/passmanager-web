import React, { useState } from 'react';
import { VaultItem } from '../types/vault';
import { securityService } from '../services/securityService';
import { SecurityIssue, SecurityScoreSummary } from '../types/security';
import { CategoryBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Copy,
  ExternalLink,
  Edit,
  CheckCircle2,
  Lock,
  Flame,
  Info,
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export interface SecurityCenterPageProps {
  items: VaultItem[];
  onEditItem: (item: VaultItem) => void;
  onNavigate: (page: string) => void;
}

export const SecurityCenterPage: React.FC<SecurityCenterPageProps> = ({
  items,
  onEditItem,
  onNavigate,
}) => {
  const [summary, setSummary] = useState<SecurityScoreSummary>(() =>
    securityService.getSummary(items)
  );
  const [issues, setIssues] = useState<SecurityIssue[]>(() =>
    securityService.getIssues(items)
  );
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'weak' | 'reused' | 'compromised' | 'recommendations'>('all');
  const [lastCheck, setLastCheck] = useState<string>('Just now');

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const newSummary = await securityService.runSecurityAudit(items);
      const newIssues = securityService.getIssues(items);
      setSummary(newSummary);
      setIssues(newIssues);
      setLastCheck(new Date().toLocaleTimeString());
    } finally {
      setIsAuditing(false);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'weak') return issue.type === 'weak';
    if (activeTab === 'reused') return issue.type === 'reused';
    if (activeTab === 'compromised') return issue.type === 'compromised';
    return true;
  });

  const weakCount = issues.filter((i) => i.type === 'weak').length;
  const reusedCount = issues.filter((i) => i.type === 'reused').length;
  const compromisedCount = issues.filter((i) => i.type === 'compromised').length;

  return (
    <div className="space-y-6">
      {/* Main Health Score Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Overall Vault Health
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight tabular-nums">
                {summary.overallScore}%
              </span>
              <div className="text-xs">
                <span className="font-semibold text-blue-300 block">
                  {summary.overallScore >= 80 ? 'Grade: Excellent' : summary.overallScore >= 60 ? 'Grade: Moderate Risk' : 'Grade: High Vulnerability'}
                </span>
                <span className="text-slate-400">
                  {summary.totalAnalyzed} accounts audited · Last checked: {lastCheck}
                </span>
              </div>
            </div>

            {/* Visual health bar */}
            <div className="w-full sm:w-96 bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  summary.overallScore >= 80
                    ? 'bg-emerald-500'
                    : summary.overallScore >= 60
                    ? 'bg-blue-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${summary.overallScore}%` }}
              />
            </div>
          </div>

          {/* Run Audit Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="primary"
              size="md"
              isLoading={isAuditing}
              leftIcon={<RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />}
              onClick={handleRunAudit}
            >
              Run Security Audit
            </Button>
          </div>
        </div>

        {/* Breakdown Metric Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Strong Passwords</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block font-mono tabular-nums">
              {summary.strongCount}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Weak Passwords</span>
            <span className="text-xl font-bold text-amber-400 mt-1 block font-mono tabular-nums">
              {summary.weakCount}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Reused Passwords</span>
            <span className="text-xl font-bold text-cyan-400 mt-1 block font-mono tabular-nums">
              {summary.reusedCount}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Breach Alerts</span>
            <span className="text-xl font-bold text-red-400 mt-1 block font-mono tabular-nums">
              {summary.compromisedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Issues & Recommendations Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              All Issues ({issues.length})
            </button>
            <button
              onClick={() => setActiveTab('weak')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'weak'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Weak Passwords ({weakCount})
            </button>
            <button
              onClick={() => setActiveTab('reused')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'reused'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Reused ({reusedCount})
            </button>
            <button
              onClick={() => setActiveTab('compromised')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'compromised'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Breach Flags ({compromisedCount})
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'recommendations'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Recommendations
            </button>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'recommendations' ? (
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                1. Eliminate Reused Credentials Across Domains
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Reusing the same password across personal streaming (e.g. Netflix, Spotify) and banking allows
                credential stuffing attacks. Use the PassForge Generator to assign unique 18-character keys.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => onNavigate('vault')}
              >
                Go to Vault to Update
              </Button>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                2. Upgrade Short Passwords Below 14 Characters
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Accounts like Epic Games currently have low entropy scores. Increasing password length to 18+ characters
                drastically increases brute-force computation resistance.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                3. Prepare Hardware 2FA Keys for Financial Accounts
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                For Banking and High-Privilege Work accounts, combine PassForge with FIDO2/WebAuthn hardware security keys.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIssues.map((issue) => {
              const matchedItem = items.find((i) => i.id === issue.vaultItemId);

              return (
                <div
                  key={issue.id}
                  className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          issue.severity === 'critical'
                            ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {issue.type}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">{issue.title}</h4>
                      <CategoryBadge category={issue.category} />
                    </div>

                    <p className="text-xs text-slate-300">{issue.description}</p>
                    <p className="text-[11px] text-blue-300/80">
                      Recommendation: {issue.recommendation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {matchedItem && (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Edit className="w-3.5 h-3.5" />}
                        onClick={() => onEditItem(matchedItem)}
                      >
                        Fix Password
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
