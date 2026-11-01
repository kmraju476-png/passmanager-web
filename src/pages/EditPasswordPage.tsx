import React, { useState, useEffect } from 'react';
import { VaultItem, VaultCategory, UpdateVaultItemDto } from '../types/vault';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import {
  Eye,
  EyeOff,
  Sparkles,
  Star,
  Globe,
  User,
  Shield,
  Save,
  ArrowLeft,
  Trash2,
  Check,
} from 'lucide-react';
import { generateSecurePassword } from '../utils/cryptoGenerator';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { formatDate } from '../utils/formatters';

export interface EditPasswordPageProps {
  item: VaultItem;
  onSave: (dto: UpdateVaultItemDto) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

export const EditPasswordPage: React.FC<EditPasswordPageProps> = ({
  item,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [title, setTitle] = useState(item.title);
  const [url, setUrl] = useState(item.url);
  const [username, setUsername] = useState(item.username);
  const [password, setPassword] = useState(item.password);
  const [category, setCategory] = useState<VaultCategory>(item.category);
  const [notes, setNotes] = useState(item.notes || '');
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [generatedFlash, setGeneratedFlash] = useState(false);

  useEffect(() => {
    setTitle(item.title);
    setUrl(item.url);
    setUsername(item.username);
    setPassword(item.password);
    setCategory(item.category);
    setNotes(item.notes || '');
    setIsFavorite(item.isFavorite);
  }, [item]);

  const categories: VaultCategory[] = [
    'Work',
    'Banking',
    'Social Media',
    'Gaming',
    'Entertainment',
    'Shopping',
    'Other',
  ];

  const strength = evaluatePasswordStrength(password);

  const handleGenerate = () => {
    const newPwd = generateSecurePassword({
      length: 18,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
    });
    setPassword(newPwd);
    setShowPassword(true);
    setGeneratedFlash(true);
    setTimeout(() => setGeneratedFlash(false), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Account name is required';
    if (!username.trim()) newErrors.username = 'Username or email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: item.id,
      title: title.trim(),
      url: url.trim(),
      username: username.trim(),
      password,
      category,
      notes: notes.trim(),
      isFavorite,
    });
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(item.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vault</span>
        </button>
        <span className="text-xs text-slate-400 font-mono">
          Last modified {formatDate(item.updatedAt)}
        </span>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Edit Credential</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Update credentials stored in your master vault.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className={`p-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              confirmDelete
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:text-red-400 hover:bg-red-950/30'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{confirmDelete ? 'Confirm Delete?' : 'Delete'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Account / Website Name"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              error={errors.title}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VaultCategory)}
                className="w-full bg-[#0a0f1d] text-slate-100 rounded-lg border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm px-3.5 py-2.5 outline-none transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0a0f1d]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* URL & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Website URL"
              leftIcon={<Globe className="w-4 h-4" />}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <Input
              label="Username / Email"
              leftIcon={<User className="w-4 h-4" />}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors((prev) => ({ ...prev, username: '' }));
              }}
              error={errors.username}
              required
            />
          </div>

          {/* Password with inline generator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={handleGenerate}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {generatedFlash ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Replaced with New Password</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate New Password</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                error={errors.password}
                required
                className="font-mono"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            {/* Strength Meter Bar */}
            {password && (
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-400" />
                    Strength Evaluation
                  </span>
                  <span className={`font-semibold ${strength.color}`}>
                    {strength.label} ({strength.score}/100)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${strength.barColor} transition-all duration-300`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Notes &amp; Recovery Codes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0a0f1d] text-slate-100 placeholder:text-slate-500 rounded-lg border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs p-3 outline-none transition-colors resize-none"
            />
          </div>

          {/* Favorite Toggle */}
          <div className="pt-2">
            <label className="inline-flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="flex items-center gap-1.5">
                <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                Mark as Favourite for quick access
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-5 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
