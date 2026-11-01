import React, { useState } from 'react';
import { VaultItem } from '../../types/vault';
import { Modal } from '../common/Modal';
import { CategoryBadge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Star,
  ExternalLink,
  Calendar,
  Lock,
  Edit,
  FileText,
  Shield,
} from 'lucide-react';
import { formatDate, extractDomain } from '../../utils/formatters';
import { evaluatePasswordStrength } from '../../utils/passwordStrength';

export interface CredentialDetailModalProps {
  item: VaultItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: VaultItem) => void;
  onToggleFavorite: (id: string) => void;
  onCopyPassword: (password: string) => void;
  onCopyUsername: (username: string) => void;
}

export const CredentialDetailModal: React.FC<CredentialDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onEdit,
  onToggleFavorite,
  onCopyPassword,
  onCopyUsername,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<'username' | 'password' | null>(null);

  if (!item) return null;

  const strength = evaluatePasswordStrength(item.password);

  const handleCopy = (field: 'username' | 'password') => {
    if (field === 'username') onCopyUsername(item.username);
    else onCopyPassword(item.password);

    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item.title}
      description={`Category: ${item.category} · Created ${formatDate(item.createdAt)}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Header badges & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CategoryBadge category={item.category} />
            <span className="text-xs font-mono text-slate-400">
              Folder: {item.folder || 'Default'}
            </span>
          </div>
          <button
            onClick={() => onToggleFavorite(item.id)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              item.isFavorite
                ? 'text-amber-400 bg-amber-950/30 border border-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Website URL */}
        <div className="bg-[#060913] p-3.5 rounded-lg border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Website URL
          </div>
          <a
            href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 font-mono break-all inline-flex items-center gap-1.5"
          >
            <span>{item.url}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>

        {/* Username / Email */}
        <div className="bg-[#060913] p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Username / Login
            </span>
            <button
              onClick={() => handleCopy('username')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedField === 'username' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Username</span>
                </>
              )}
            </button>
          </div>
          <div className="text-sm font-mono text-white break-all">{item.username}</div>
        </div>

        {/* Password */}
        <div className="bg-[#060913] p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleCopy('password')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'password' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Password</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="text-sm font-mono text-white tracking-wider break-all py-1">
            {showPassword ? item.password : '•'.repeat(item.password.length)}
          </div>

          {/* Strength assessment */}
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                Password Strength
              </span>
              <span className={`font-semibold ${strength.color}`}>{strength.label} ({strength.score}/100)</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${strength.barColor} transition-all duration-300`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div className="bg-[#060913] p-3.5 rounded-lg border border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Notes &amp; Recovery Keys
            </div>
            <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {item.notes}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <div>
              <span className="block text-[11px] text-slate-400">Created</span>
              <span className="text-slate-300 font-mono">{formatDate(item.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <div>
              <span className="block text-[11px] text-slate-400">Last Updated</span>
              <span className="text-slate-300 font-mono">{formatDate(item.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Edit className="w-3.5 h-3.5" />}
            onClick={() => {
              onClose();
              onEdit(item);
            }}
          >
            Edit Credential
          </Button>
        </div>
      </div>
    </Modal>
  );
};
