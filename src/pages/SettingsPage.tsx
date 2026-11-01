import React, { useState } from 'react';
import { settingsService } from '../services/settingsService';
import { AppSettings } from '../types/settings';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import {
  Settings,
  Shield,
  Clock,
  Clipboard,
  Moon,
  Laptop,
  Lock,
  Save,
  RotateCcw,
  CheckCircle2,
  Download,
  AlertTriangle,
} from 'lucide-react';

export interface SettingsPageProps {
  onShowToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onShowToast }) => {
  const [settings, setSettings] = useState<AppSettings>(() => settingsService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    settingsService.updateSettings(settings);
    setSavedSuccess(true);
    onShowToast('Settings saved successfully', 'Preferences have been stored in session state.', 'success');
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    const defaults = settingsService.resetDefaults();
    setSettings(defaults);
    onShowToast('Settings reset', 'Restored factory default preferences.', 'info');
  };

  const handleExportPreview = () => {
    onShowToast(
      'Export Vault',
      'Encrypted JSON backup file generated for offline storage.',
      'info'
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Application Preferences &amp; Security
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure security timeouts, clipboard handling, and account hardening.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Theme Preferences */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
            <Moon className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Visual Appearance</h3>
              <p className="text-xs text-slate-400">Select dashboard theme preference</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, theme: 'dark' }))}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                settings.theme === 'dark'
                  ? 'bg-blue-950/30 border-blue-500/50 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">Deep Cyber Blue &amp; Black</span>
                {settings.theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
              </div>
              <p className="text-xs text-slate-400">
                Default high-contrast dark palette (#030712) with electric blue illumination.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, theme: 'amoled' }))}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                settings.theme === 'amoled'
                  ? 'bg-blue-950/30 border-blue-500/50 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">AMOLED Pure Black</span>
                {settings.theme === 'amoled' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
              </div>
              <p className="text-xs text-slate-400">
                True #000000 background for OLED workstations with azure accents.
              </p>
            </button>
          </div>
        </div>

        {/* Auto-Lock Preferences */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
            <Clock className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Auto-Lock Inactivity Timeout</h3>
              <p className="text-xs text-slate-400">
                Automatically purge decrypted master keys from volatile memory when idle
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[1, 5, 15, 30, 0].map((mins) => {
                const label = mins === 0 ? 'Never' : `${mins} min`;
                const isSelected = settings.autoLockMinutes === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, autoLockMinutes: mins }))}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400">
              Recommended: 15 minutes. Set to Never only on secure personal workstations.
            </p>
          </div>
        </div>

        {/* Clipboard Clearing Preferences */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
            <Clipboard className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Clipboard Purge Delay</h3>
              <p className="text-xs text-slate-400">
                Automatically clears copied passwords from the OS clipboard
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[15, 30, 60, 0].map((secs) => {
                const label = secs === 0 ? 'Do Not Clear' : `${secs} Seconds`;
                const isSelected = settings.clearClipboardSeconds === secs;
                return (
                  <button
                    key={secs}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, clearClipboardSeconds: secs }))}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400">
              PassForge securely overwrites clipboard memory to prevent snooping by unauthorized background desktop processes.
            </p>
          </div>
        </div>

        {/* Account Security & Toggles */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Vault Security Controls</h3>
              <p className="text-xs text-slate-400">Hardware tokens and masking policies</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Mask Passwords by Default
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Always require explicit click to reveal secret characters in cards
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.maskPasswordsByDefault}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, maskPasswordsByDefault: e.target.checked }))
                }
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Two-Factor Authentication (2FA)
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Hardware FIDO2 Security Key + TOTP Authenticator Apps
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorAuthEnabled}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, twoFactorAuthEnabled: e.target.checked }))
                }
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Proactive Vulnerability Notifications
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Notify when credentials are older than 180 days or flagged in audits
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyOnWeakPassword}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, notifyOnWeakPassword: e.target.checked }))
                }
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
            </div>
          </div>
        </div>

        {/* Vault Export & Backup */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Encrypted Vault Backup</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Download zero-knowledge backup file for offline archival
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExportPreview}
            >
              Export Vault
            </Button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4">
          <Button type="button" variant="ghost" onClick={handleReset} leftIcon={<RotateCcw className="w-4 h-4" />}>
            Reset to Defaults
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          >
            {savedSuccess ? 'Preferences Saved' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </div>
  );
};
