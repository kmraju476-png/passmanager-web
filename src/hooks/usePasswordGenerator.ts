import { useState, useCallback, useEffect } from 'react';
import {
  GeneratorOptions,
  DEFAULT_GENERATOR_OPTIONS,
  generateSecurePassword,
  calculateEntropy,
  generatePassphrase,
} from '../utils/cryptoGenerator';
import { evaluatePasswordStrength, PasswordStrengthResult } from '../utils/passwordStrength';

export function usePasswordGenerator(initialOptions: Partial<GeneratorOptions> = {}) {
  const [options, setOptions] = useState<GeneratorOptions>({
    ...DEFAULT_GENERATOR_OPTIONS,
    ...initialOptions,
  });
  const [mode, setMode] = useState<'random' | 'passphrase'>('random');
  const [passphraseWords, setPassphraseWords] = useState<number>(4);
  const [password, setPassword] = useState<string>('');
  const [entropy, setEntropy] = useState<number>(0);
  const [strength, setStrength] = useState<PasswordStrengthResult>(() =>
    evaluatePasswordStrength('')
  );
  const [copied, setCopied] = useState<boolean>(false);

  const generate = useCallback(() => {
    let newPassword = '';
    if (mode === 'random') {
      newPassword = generateSecurePassword(options);
    } else {
      newPassword = generatePassphrase(passphraseWords, '-');
    }
    setPassword(newPassword);
    setEntropy(calculateEntropy(newPassword));
    setStrength(evaluatePasswordStrength(newPassword));
    setCopied(false);
  }, [mode, options, passphraseWords]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyToClipboard = useCallback(async () => {
    if (!password) return false;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }, [password]);

  const updateOption = useCallback(
    <K extends keyof GeneratorOptions>(key: K, value: GeneratorOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return {
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
  };
}
