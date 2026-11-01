import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { UserProfile } from '../types/auth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import {
  User,
  Shield,
  KeyRound,
  FileSpreadsheet,
  Laptop,
  Smartphone,
  Calendar,
  AlertTriangle,
  Download,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export interface ProfilePageProps {
  onShowToast: (title: string, description?: string, type?: 'success' | 'info') => void;
  onNavigate: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onShowToast, onNavigate }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showKitModal, setShowKitModal] = useState(false);

  useEffect(() => {
    let active = true;
    authService.getCurrentUser()
      .then((currentUser) => {
        if (!active) return;
        if (!currentUser) {
          setProfileError('No signed-in user profile is available.');
          return;
        }
        setUser(currentUser);
        setFullName(currentUser.fullName);
        setEmail(currentUser.email);
      })
      .catch((error: unknown) => {
        if (active) {
          setProfileError(
            error instanceof Error ? error.message : 'Unable to load your profile.'
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    if (!fullName.trim()) {
      setProfileError('Display name is required.');
      return;
    }
    setIsSaving(true);
    try {
      const updatedUser = await authService.updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
      });
      setUser(updatedUser);
      setFullName(updatedUser.fullName);
      setEmail(updatedUser.email);
      onShowToast('Profile updated', 'Your account details have been updated.', 'success');
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Unable to update your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadKit = () => {
    setShowKitModal(false);
    onShowToast(
      'Emergency Kit Generated',
      'A secure PDF containing your 24-word recovery secret key has been prepared for download.',
      'info'
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          User Account &amp; Master Identity
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your PassForge identity, emergency recovery keys, and active sessions.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center font-extrabold text-2xl text-white shadow-lg shadow-blue-600/30">
            {fullName.trim()
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .join('')
              .slice(0, 2) || '?'}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">{fullName || 'Your account'}</h3>
            <p className="text-xs text-slate-400 font-mono">{email}</p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Member since {user ? formatDate(user.createdAt) : '—'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Vault Master</span>
            </div>
          </div>
        </div>

        {/* Edit Info Form */}
        <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
          {profileError && (
            <p role="alert" className="text-sm text-red-400">
              {profileError}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading || isSaving || !user}
              required
            />
            <Input
              label="Account Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isSaving || !user}
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" disabled={isLoading || isSaving || !user}>
              {isLoading ? 'Loading Profile…' : isSaving ? 'Saving…' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </div>

      {/* Emergency Recovery Kit Card */}
      <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 bg-blue-950/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Emergency Recovery Kit</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Contains your 24-word cryptographic recovery phrase and master vault public fingerprint.
                Store printed offline in a fireproof safe.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => setShowKitModal(true)}
            className="shrink-0"
          >
            Download Kit
          </Button>
        </div>
      </div>

      {/* Active Workstations & Sessions */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-1">Active Workstations &amp; Devices</h3>
        <p className="text-xs text-slate-400 mb-4">
          Workstations authorized to decrypt your master vault
        </p>

        <div className="divide-y divide-slate-800/80">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-blue-400">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">
                  Windows 11 Workstation (Chrome 130)
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Current Active Session · IP: 192.168.1.104
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Active Now</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">
                  iPhone 16 Pro (PassForge iOS App)
                </span>
                <span className="text-[11px] text-slate-400">
                  Biometric FaceID Linked · Last accessed 2 days ago
                </span>
              </div>
            </div>
            <button
              onClick={() => onShowToast('Session Revoked', 'Mobile token invalidated.', 'info')}
              className="text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer"
            >
              Revoke
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-panel p-6 rounded-2xl border border-red-500/20 bg-red-950/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-red-300">Danger Zone</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Reset vault credentials and restore default workspace settings
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => setShowDeleteModal(true)}
          >
            Reset Master Vault
          </Button>
        </div>
      </div>

      {/* Emergency Kit Modal */}
      <Modal
        isOpen={showKitModal}
        onClose={() => setShowKitModal(false)}
        title="PassForge Emergency Recovery Kit"
        description="Save your master cryptographic recovery phrase"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
            Never share this phrase with anyone. It can decrypt all passwords without your master password.
          </div>

          <div className="bg-[#04060c] border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 grid grid-cols-3 gap-2">
            {[
              '1. falcon', '2. horizon', '3. nebula', '4. glacier',
              '5. quantum', '6. cipher', '7. timber', '8. vertex',
              '9. aurora', '10. beacon', '11. breeze', '12. canyon',
              '13. cobalt', '14. crystal', '15. eclipse', '16. ember',
              '17. granite', '18. kinetic', '19. matrix', '20. monarch',
              '21. onyx', '22. orbit', '23. radiant', '24. zenith'
            ].map((word) => (
              <span key={word} className="p-1 rounded bg-slate-900/60 border border-slate-800/80">
                {word}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setShowKitModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleDownloadKit}
            >
              Confirm &amp; Download PDF
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete/Reset Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Vault Reset"
        description="Are you sure you want to reset your vault?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            This will purge in-memory session changes and reset your workspace.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setShowDeleteModal(false);
                window.location.reload();
              }}
            >
              Reset Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
