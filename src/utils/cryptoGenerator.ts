/**
 * Web Crypto API-based cryptographically secure password generator.
 * Strictly avoids Math.random() as mandated for security dashboards.
 */

export interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
}

export const DEFAULT_GENERATOR_OPTIONS: GeneratorOptions = {
  length: 18,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
};

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

const AMBIGUOUS_CHARS = new Set(['0', 'O', 'o', '1', 'l', 'I', '|']);

/**
 * Filter character set to exclude ambiguous characters if requested.
 */
function filterSet(chars: string, excludeAmbiguous: boolean): string {
  if (!excludeAmbiguous) return chars;
  return chars
    .split('')
    .filter((c) => !AMBIGUOUS_CHARS.has(c))
    .join('');
}

/**
 * Generates a cryptographically secure random integer in [0, max - 1]
 * using the Web Crypto API without modulo bias.
 */
function secureRandomInt(max: number): number {
  if (max <= 0) return 0;
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Web Crypto API (crypto.getRandomValues) is not available');
  }

  // Use rejection sampling to eliminate modulo bias
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % max);
  const buffer = new Uint32Array(1);

  while (true) {
    cryptoObj.getRandomValues(buffer);
    const val = buffer[0];
    if (val < limit) {
      return val % max;
    }
  }
}

/**
 * Generates a cryptographically secure password based on provided options.
 */
export function generateSecurePassword(
  options: GeneratorOptions = DEFAULT_GENERATOR_OPTIONS
): string {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeAmbiguous,
  } = options;

  let pool = '';
  const requiredChars: string[] = [];

  const uppers = filterSet(UPPERCASE, excludeAmbiguous);
  const lowers = filterSet(LOWERCASE, excludeAmbiguous);
  const nums = filterSet(NUMBERS, excludeAmbiguous);
  const syms = filterSet(SYMBOLS, excludeAmbiguous);

  if (includeUppercase && uppers.length > 0) {
    pool += uppers;
    requiredChars.push(uppers[secureRandomInt(uppers.length)]);
  }
  if (includeLowercase && lowers.length > 0) {
    pool += lowers;
    requiredChars.push(lowers[secureRandomInt(lowers.length)]);
  }
  if (includeNumbers && nums.length > 0) {
    pool += nums;
    requiredChars.push(nums[secureRandomInt(nums.length)]);
  }
  if (includeSymbols && syms.length > 0) {
    pool += syms;
    requiredChars.push(syms[secureRandomInt(syms.length)]);
  }

  // Fallback to lowercase if everything was toggled off
  if (pool.length === 0) {
    pool = lowers.length > 0 ? lowers : LOWERCASE;
    requiredChars.push(pool[secureRandomInt(pool.length)]);
  }

  const result: string[] = [...requiredChars];
  const targetLength = Math.max(result.length, Math.min(128, length));

  while (result.length < targetLength) {
    const char = pool[secureRandomInt(pool.length)];
    result.push(char);
  }

  // Fisher-Yates shuffle using cryptographically secure random ints
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result.join('');
}

/**
 * Calculates entropy in bits based on pool size and length.
 */
export function calculateEntropy(password: string): number {
  if (!password) return 0;
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;
  if (poolSize === 0) return 0;

  return Math.round(password.length * (Math.log(poolSize) / Math.LN2));
}

const MEMORABLE_WORDS = [
  'falcon', 'horizon', 'nebula', 'glacier', 'quantum', 'cipher', 'timber',
  'vertex', 'aurora', 'beacon', 'breeze', 'canyon', 'cascade', 'cobalt',
  'crystal', 'eclipse', 'ember', 'granite', 'harbor', 'kinetic', 'matrix',
  'monarch', 'onyx', 'orbit', 'radiant', 'sapphire', 'summit', 'zenith',
  'phoenix', 'solstice', 'vanguard', 'vortex', 'whisper', 'zephyr', 'bastion'
];

/**
 * Generates a cryptographically secure memorable passphrase.
 */
export function generatePassphrase(wordCount: number = 4, separator: string = '-'): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const idx = secureRandomInt(MEMORABLE_WORDS.length);
    words.push(MEMORABLE_WORDS[idx]);
  }
  const randomNum = secureRandomInt(900) + 100;
  return `${words.join(separator)}${separator}${randomNum}`;
}
