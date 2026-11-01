import React, { useState } from 'react';
import { GeneratorControls } from '../components/generator/GeneratorControls';
import { Shield, Sparkles, Check, Key, Sliders, Lock, Info } from 'lucide-react';
import { Button } from '../components/common/Button';

export interface GeneratorPageProps {
  onNavigate?: (page: string) => void;
}

export const GeneratorPage: React.FC<GeneratorPageProps> = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Hardware-Grounded Cryptography</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Cryptographic Password Generator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Generates unpredictable passwords and high-entropy passphrases using the native browser
          Web Crypto API (<code className="text-blue-300 font-mono text-xs">crypto.getRandomValues</code>).
          Zero pseudo-random math.
        </p>
      </div>

      {/* Main Generator Interactive Card */}
      <GeneratorControls />

      {/* Security Guidance & Cryptographic Principles Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white tracking-tight">Entropy Thresholds</h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Passwords with 80+ bits of entropy are mathematically immune to offline brute-force attacks across modern GPU clusters.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
            <Shield className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white tracking-tight">Zero-Bias Sampling</h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Rejection sampling eliminates modulo bias, ensuring every character in your character set has an identical probability.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <Key className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white tracking-tight">Zero-Storage Invariant</h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Generated strings are created purely in volatile memory. They are never transmitted over the network or written to disk.
          </p>
        </div>
      </div>
    </div>
  );
};
