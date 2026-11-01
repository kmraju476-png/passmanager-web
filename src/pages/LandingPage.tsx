import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import {
  Shield,
  Lock,
  KeyRound,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <Navbar onNavigate={onNavigate} currentPage="landing" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Subtle background blue glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/50 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Password management made simple</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Your Passwords.{' '}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Your Control.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Keep your passwords organized, create strong new ones, and check the security of your accounts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="primary"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto text-base"
              >
                Launch Dashboard
              </Button>
              <Button
                size="lg"
                variant="secondary"
                leftIcon={<Sparkles className="w-5 h-5 text-blue-400" />}
                onClick={() => onNavigate('generator')}
                className="w-full sm:w-auto text-base"
              >
                Password Generator
              </Button>
            </div>

          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-[#020408]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Everything you need to stay secure
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Keep your accounts organized, create stronger passwords, and check your security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">Categorized Vault</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Keep your account details together and organized by category. Find favorites and
                  entries quickly when you need them.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800/60">
                  <button
                    onClick={() => onNavigate('vault')}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore the vault</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Strong Password Generator
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Create a unique password with the character types and length you choose.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800/60">
                  <button
                    onClick={() => onNavigate('generator')}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Try the generator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">Security Auditing</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Spot weak or reused passwords and get a clearer picture of your account security.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800/60">
                  <button
                    onClick={() => onNavigate('security')}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Security Center</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6 lg:px-8">
          <p className="max-w-3xl mx-auto text-center text-xs text-slate-500">
            Vault details are encrypted in your browser before they are saved to your Supabase account.
          </p>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center border-t border-slate-800/80 bg-gradient-to-b from-transparent to-blue-950/20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
              Ready to organize your passwords?
            </h2>
            <p className="text-sm text-slate-300 mb-8 max-w-xl mx-auto">
              Sign in or create an account to get started.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="primary"
                onClick={() => onNavigate('dashboard')}
                leftIcon={<Lock className="w-5 h-5" />}
              >
                Open Dashboard
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => onNavigate('login')}
              >
                Log in
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
