import React, { useState } from 'react';
import { VaultItem } from '../../types/vault';
import { CategoryBadge } from '../common/Badge';
import { Eye, EyeOff, Copy, Check, ExternalLink, ArrowRight, Edit3 } from 'lucide-react';
import { maskPassword, formatTimeAgo, extractDomain } from '../../utils/formatters';

export interface RecentAccountsProps {
  items: VaultItem[];
  onViewAll: () => void;
  onEdit: (item: VaultItem) => void;
  onCopyPassword: (password: string) => void;
  onCopyUsername: (username: string) => void;
}

export const RecentAccounts: React.FC<RecentAccountsProps> = ({
  items,
  onViewAll,
  onEdit,
  onCopyPassword,
  onCopyUsername,
}) => {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = (id: string, text: string, isPassword = true) => {
    if (isPassword) onCopyPassword(text);
    else onCopyUsername(text);

    setCopiedId(`${id}-${isPassword ? 'pwd' : 'usr'}`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const recentList = items.slice(0, 5);

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Recently Added &amp; Updated</h3>
          <p className="text-xs text-slate-400">Quick access to latest credentials in your vault</p>
        </div>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View All Vault</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-800/80">
        {recentList.map((item) => {
          const isRevealed = revealedIds.has(item.id);
          const domain = extractDomain(item.url);
          const isCopiedPwd = copiedId === `${item.id}-pwd`;
          const isCopiedUsr = copiedId === `${item.id}-usr`;

          return (
            <div
              key={item.id}
              className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Account info */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sm text-blue-400 uppercase shrink-0">
                  {item.title.substring(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                    <CategoryBadge category={item.category} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-mono text-slate-300 truncate max-w-[180px]">
                      {item.username}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400 text-[11px] truncate">{domain}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[11px]">{formatTimeAgo(item.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Password & quick actions */}
              <div className="flex items-center justify-between sm:justify-end gap-2 pl-12 sm:pl-0">
                <div className="flex items-center gap-2 bg-[#060913] px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-200">
                  <span className="tracking-widest">
                    {isRevealed ? item.password : maskPassword(item.password.length)}
                  </span>
                  <button
                    onClick={() => toggleReveal(item.id)}
                    className="text-slate-400 hover:text-white p-0.5"
                    title={isRevealed ? 'Hide password' : 'Show password'}
                    aria-label={isRevealed ? `Hide password for ${item.title}` : `Show password for ${item.title}`}
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(item.id, item.username, false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Copy username"
                    aria-label={`Copy username for ${item.title}`}
                  >
                    {isCopiedUsr ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-[11px] font-mono px-1 font-semibold text-slate-400 hover:text-blue-300">USER</span>}
                  </button>
                  <button
                    onClick={() => handleCopy(item.id, item.password, true)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Copy password"
                    aria-label={`Copy password for ${item.title}`}
                  >
                    {isCopiedPwd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-300 hover:bg-slate-800 transition-colors"
                    title="Edit account"
                    aria-label={`Edit ${item.title}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <a
                    href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Visit site"
                    aria-label={`Visit site for ${item.title}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
