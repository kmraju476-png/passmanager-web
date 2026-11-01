import React, { useEffect, useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Mail, KeyRound } from 'lucide-react';
import { authService } from '../services/authService';
import { deriveVaultKey } from '../utils/vaultCrypto';
import { UserProfile } from '../types/auth';

function getAuthErrorDetails(error: unknown) {
  const fields = typeof error === 'object' && error !== null
    ? error as { status?: unknown; code?: unknown }
    : {};

  return {
    message: error instanceof Error ? error.message : String(error),
    status: typeof fields.status === 'number' ? fields.status : undefined,
    code: typeof fields.code === 'string' ? fields.code : undefined,
  };
}

export interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (
    userId: string,
    email: string,
    vaultKey: CryptoKey,
    fullName: string
  ) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeSession, setActiveSession] = useState<UserProfile | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    authService.getCurrentUser()
      .then((user) => {
        if (!active || !user) return;
        setActiveSession(user);
        setEmail(user.email);
        console.log('[Supabase Auth] Existing session found; login form is in vault-unlock mode.');
      })
      .catch((sessionError: unknown) => {
        if (!active) return;
        const details = getAuthErrorDetails(sessionError);
        console.error('[Supabase Auth] Failed to check the current session', details);
        setError(
          details.message || 'Could not check the current authentication session.'
        );
      })
      .finally(() => {
        if (active) setIsCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      const user = currentUser
        ? currentUser
        : (await authService.login({ email: email.trim(), masterPassword: password })).user;
      const vaultKey = await deriveVaultKey(password, user.id);
      onLoginSuccess(user.id, user.email, vaultKey, user.fullName);
    } catch (loginError) {
      const details = getAuthErrorDetails(loginError);
      console.error('[Supabase Auth] Login or vault unlock failed', details);
      setError(details.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle radial ambient blue glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-[#080d1a]/85 backdrop-blur-xl border border-blue-500/15 rounded-2xl p-7 sm:p-8 shadow-2xl shadow-blue-950/30">
          {/* Password Manager Icon & Application Name Only */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3.5">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Pass<span className="text-blue-400">Forge</span>
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              {activeSession
                ? 'Your email is confirmed. Enter your master password to unlock your vault.'
                : 'Sign in to unlock your vault.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 py-2 px-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 text-center font-medium">
              {error}
            </div>
          )}

          {activeSession && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-500/25 bg-blue-950/30 px-3 py-2 text-xs text-blue-200">
              <KeyRound className="h-4 w-4 shrink-0" />
              <span>Signed in as {activeSession.email}. Your vault is locked.</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-300"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  readOnly={Boolean(activeSession)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full bg-[#04060c] text-slate-100 placeholder:text-slate-600 rounded-xl border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm pl-10 pr-3.5 py-2.5 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full bg-[#04060c] text-slate-100 placeholder:text-slate-600 rounded-xl border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm pl-10 pr-10 py-2.5 outline-none transition-colors font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300 p-1 cursor-pointer transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={isLoading || isCheckingSession}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>
                  {isCheckingSession
                    ? 'Checking session…'
                    : activeSession
                      ? 'Unlock Vault'
                      : 'Log In'}
                </span>
              )}
            </button>
          </form>

          {!activeSession && (
            <div className="mt-6 text-center text-xs text-slate-400">
              <span>New to PassForge? </span>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 cursor-pointer"
              >
                Create an account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
