import React, { useState } from 'react';
import { VaultItem } from '../../types/vault';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Star,
  Trash2,
  Edit2,
  ExternalLink,
} from 'lucide-react';
import { maskPassword, extractDomain } from '../../utils/formatters';

export interface CredentialCardProps {
  item: VaultItem;
  onEdit: (item: VaultItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCopyPassword: (password: string) => void;
  onCopyUsername: (username: string) => void;
  onViewDetails?: (item: VaultItem) => void;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleFavorite,
  onCopyPassword,
  onCopyUsername,
  onViewDetails,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<'username' | 'password' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const domain = extractDomain(item.url);

  const handleCopyUsername = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyUsername(item.username);
    setCopiedField('username');
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleCopyPassword = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyPassword(item.password);
    setCopiedField('password');
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(item.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="bg-[#070b16] hover:bg-[#0c1222] border border-slate-800/80 hover:border-blue-500/40 rounded-xl p-4 sm:p-5 transition-all duration-150 flex flex-col justify-between group">
      <div>
        {/* Header: Service Name, Domain, Favorite, Edit, Delete */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/25 flex items-center justify-center font-bold text-xs text-blue-300 uppercase shrink-0">
              {item.title.substring(0, 2)}
            </div>
            <div className="min-w-0">
              <h3
                onClick={() => onViewDetails?.(item)}
                className="text-sm font-semibold text-white truncate cursor-pointer hover:text-blue-300 transition-colors"
              >
                {item.title}
              </h3>
              <a
                href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1 truncate transition-colors"
              >
                <span>{domain}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleFavorite(item.id)}
              className="p-1.5 rounded-md text-slate-500 hover:text-amber-400 hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label={item.isFavorite ? 'Remove favorite' : 'Add favorite'}
              title={item.isFavorite ? 'Favorited' : 'Favorite'}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  item.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                }`}
              />
            </button>
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label={`Edit ${item.title}`}
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                confirmDelete
                  ? 'bg-red-600 text-white text-[10px] px-1.5 font-medium'
                  : 'text-slate-500 hover:text-red-400 hover:bg-slate-800/60'
              }`}
              aria-label={`Delete ${item.title}`}
              title={confirmDelete ? 'Click to confirm delete' : 'Delete'}
            >
              {confirmDelete ? 'Confirm' : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Category tag */}
        <div className="mb-3.5">
          <span className="text-[11px] font-medium text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            {item.category}
          </span>
        </div>

        {/* Username row */}
        <div className="bg-[#04060c] rounded-lg border border-slate-800/60 px-3 py-2 flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-slate-300 font-mono truncate select-all">
            {item.username}
          </span>
          <button
            onClick={handleCopyUsername}
            className="p-1 text-slate-500 hover:text-slate-200 transition-colors shrink-0 cursor-pointer"
            title="Copy username"
            aria-label="Copy username"
          >
            {copiedField === 'username' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Password row */}
        <div className="bg-[#04060c] rounded-lg border border-slate-800/60 px-3 py-2 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-300 font-mono tracking-wider truncate">
            {showPassword ? item.password : maskPassword(10)}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleCopyPassword}
              className="p-1 text-slate-500 hover:text-blue-300 transition-colors cursor-pointer"
              title="Copy password"
              aria-label="Copy password"
            >
              {copiedField === 'password' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
