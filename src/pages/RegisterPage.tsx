import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertCircle, Fingerprint } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { authService } from '../services/authService';
import { deriveVaultKey } from '../utils/vaultCrypto';

export interface RegisterPageProps {
  onNavigate: (page: string) => void;
  onRegisterSuccess: (userId: string, vaultKey: CryptoKey, fullName: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const strength = evaluatePasswordStrength(masterPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!fullName || !email || !masterPassword) {
      setError('All fields are required.');
      return;
    }

    if (masterPassword !== confirmPassword) {
      setError('Master passwords do not match.');
      return;
    }

    if (masterPassword.length < 12) {
      setError('Master password must be at least 12 characters.');
      return;
    }

    if (!acceptedTerms) {
      setError('You must acknowledge that master passwords cannot be reset by PassForge.');
      return;
    }

    setIsLoading(true);
    try {
      const session = await authService.register({
        fullName: fullName.trim(),
        email: email.trim(),
        masterPassword,
        confirmPassword,
        enableBiometrics,
      });
      if (session) {
        const vaultKey = await deriveVaultKey(masterPassword, session.user.id);
        onRegisterSuccess(session.user.id, vaultKey, session.user.fullName);
      } else {
        setMessage('Check your email for a confirmation link, then return here to log in.');
      }
    } catch (registrationError) {
      setError(
        registrationError instanceof Error
          ? registrationError.message
          : 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <button
          onClick={() => onNavigate('landing')}
          className="mx-auto flex items-center justify-center gap-2.5 group cursor-pointer focus:outline-none mb-6"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">
            Pass<span className="text-blue-400">Forge</span>
          </span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Create Master Security Vault
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Zero-knowledge vault initialization · Argon2id key derivation
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Vance"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.vance@example.com"
              required
            />

            <div className="space-y-1.5">
              <Input
                label="Master Password"
                type={showPassword ? 'text' : 'password'}
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Minimum 12+ characters"
                required
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

              {/* Master Password Strength Meter */}
              {masterPassword && (
                <div className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Master Key Strength</span>
                    <span className={`font-semibold ${strength.color}`}>{strength.label} ({strength.score}/100)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${strength.barColor} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                  {strength.suggestions.length > 0 && (
                    <p className="text-[11px] text-slate-400 pt-0.5">
                      {strength.suggestions[0]}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Input
              label="Confirm Master Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter master password"
              required
            />

            {/* Biometric Toggle */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Fingerprint className="w-4 h-4 text-blue-400" />
                <div>
                  <span className="text-xs font-semibold text-white block">Windows Hello / Touch ID</span>
                  <span className="text-[10px] text-slate-400 block">Fast biometric master key unlock</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableBiometrics}
                onChange={(e) => setEnableBiometrics(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
              />
            </div>

            {/* Zero-knowledge acknowledgement */}
            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs">
              <label className="flex items-start gap-2.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span className="text-[11px] text-slate-300 leading-relaxed">
                  I understand that PassForge uses strict zero-knowledge architecture. If I lose my
                  Master Password and Emergency Kit, no one—not even PassForge—can recover my vault.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              leftIcon={<Lock className="w-4 h-4" />}
              className="w-full mt-2"
            >
              Create Master Vault
            </Button>
          </form>

          {/* Login switch */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <span>Already have a vault? </span>
            <button
              onClick={() => onNavigate('login')}
              className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 cursor-pointer"
            >
              Unlock Vault
            </button>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate('landing')}
            className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
          >
            ← Back to PassForge Overview
          </button>
        </div>
      </div>
    </div>
  );
};
