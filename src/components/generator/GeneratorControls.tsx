import React from 'react';
import { usePasswordGenerator } from '../../hooks/usePasswordGenerator';
import { Button } from '../common/Button';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Shield,
  Zap,
  Sliders,
  CheckSquare,
  Square,
} from 'lucide-react';

export interface GeneratorControlsProps {
  onUsePassword?: (password: string) => void;
  showUseButton?: boolean;
}

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  onUsePassword,
  showUseButton = false,
}) => {
  const {
    password,
    options,
    mode,
    passphraseWords,
    entropy,
    strength,
    copied,
    setMode,
    setPassphraseWords,
    updateOption,
    generate,
    copyToClipboard,
  } = usePasswordGenerator();

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-blue-500/20 max-w-3xl mx-auto shadow-xl">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Cryptographic Password Generator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Powered by Browser Web Crypto API (<code className="text-blue-300 font-mono text-[11px]">crypto.getRandomValues</code>)
          </p>
        </div>

        {/* Tab segmented control */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setMode('random')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              mode === 'random'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Random String
          </button>
          <button
            onClick={() => setMode('passphrase')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              mode === 'passphrase'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Memorable Passphrase
          </button>
        </div>
      </div>

      {/* Generated Password Output Box */}
      <div className="bg-[#04060c] border border-blue-500/30 rounded-xl p-4 sm:p-5 mb-6 shadow-inner relative group">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-base sm:text-xl font-semibold text-white tracking-wider break-all select-all flex-1 py-1">
            {password || 'Generating...'}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={generate}
              className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer active:rotate-180"
              title="Generate new password"
              aria-label="Generate new password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              onClick={copyToClipboard}
              className="h-[38px]"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Strength & Entropy Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${strength.barColor} transition-all duration-300`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
            <span className={`text-xs font-bold ${strength.color}`}>
              {strength.label} ({strength.score}/100)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Entropy: <strong className="text-white">{entropy} bits</strong></span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Length: <strong className="text-white">{password.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Generator Options Configuration */}
      {mode === 'random' ? (
        <div className="space-y-6">
          {/* Length Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                Password Length
              </span>
              <span className="font-mono text-sm font-bold text-blue-400 bg-blue-950/40 px-2.5 py-0.5 rounded border border-blue-500/20">
                {options.length} characters
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={options.length}
              onChange={(e) => updateOption('length', parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>8 (Minimum)</span>
              <span>18 (Recommended)</span>
              <span>32</span>
              <span>64 (Maximum)</span>
            </div>
          </div>

          {/* Character Toggles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Uppercase Toggle */}
            <button
              type="button"
              onClick={() => updateOption('includeUppercase', !options.includeUppercase)}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                options.includeUppercase
                  ? 'bg-blue-950/30 border-blue-500/40 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {options.includeUppercase ? (
                  <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <div>
                  <span className="block font-semibold">Uppercase Letters</span>
                  <span className="text-[11px] text-slate-400 font-mono">A-Z</span>
                </div>
              </div>
            </button>

            {/* Lowercase Toggle */}
            <button
              type="button"
              onClick={() => updateOption('includeLowercase', !options.includeLowercase)}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                options.includeLowercase
                  ? 'bg-blue-950/30 border-blue-500/40 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {options.includeLowercase ? (
                  <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <div>
                  <span className="block font-semibold">Lowercase Letters</span>
                  <span className="text-[11px] text-slate-400 font-mono">a-z</span>
                </div>
              </div>
            </button>

            {/* Numbers Toggle */}
            <button
              type="button"
              onClick={() => updateOption('includeNumbers', !options.includeNumbers)}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                options.includeNumbers
                  ? 'bg-blue-950/30 border-blue-500/40 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {options.includeNumbers ? (
                  <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <div>
                  <span className="block font-semibold">Numbers &amp; Digits</span>
                  <span className="text-[11px] text-slate-400 font-mono">0-9</span>
                </div>
              </div>
            </button>

            {/* Special Characters Toggle */}
            <button
              type="button"
              onClick={() => updateOption('includeSymbols', !options.includeSymbols)}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                options.includeSymbols
                  ? 'bg-blue-950/30 border-blue-500/40 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {options.includeSymbols ? (
                  <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <div>
                  <span className="block font-semibold">Symbols &amp; Punctuation</span>
                  <span className="text-[11px] text-slate-400 font-mono">!@#$%^&amp;*</span>
                </div>
              </div>
            </button>

            {/* Exclude Ambiguous */}
            <button
              type="button"
              onClick={() => updateOption('excludeAmbiguous', !options.excludeAmbiguous)}
              className={`sm:col-span-2 flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                options.excludeAmbiguous
                  ? 'bg-blue-950/30 border-blue-500/40 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {options.excludeAmbiguous ? (
                  <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <div>
                  <span className="block font-semibold">Avoid Ambiguous Characters</span>
                  <span className="text-[11px] text-slate-400">
                    Excludes easily confused characters like <code className="text-blue-300 font-mono">0, O, o, 1, l, I, |</code>
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Passphrase Configuration */
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 uppercase tracking-wider">
                Word Count
              </span>
              <span className="font-mono text-sm font-bold text-blue-400 bg-blue-950/40 px-2.5 py-0.5 rounded border border-blue-500/20">
                {passphraseWords} words
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="8"
              value={passphraseWords}
              onChange={(e) => setPassphraseWords(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>3 words</span>
              <span>4 words (Recommended)</span>
              <span>6 words</span>
              <span>8 words</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Passphrases generate memorable, cryptographically randomized natural dictionary words
            separated by hyphens with an appended random numeric pin.
          </p>
        </div>
      )}

      {/* Bottom action buttons */}
      <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="md"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={generate}
        >
          Regenerate
        </Button>

        {showUseButton && onUsePassword && (
          <Button
            variant="primary"
            size="md"
            leftIcon={<Zap className="w-4 h-4" />}
            onClick={() => onUsePassword(password)}
          >
            Use This Password
          </Button>
        )}
      </div>
    </div>
  );
};
