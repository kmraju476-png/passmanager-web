export interface PasswordStrengthResult {
  score: number; // 0 - 100
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  color: string;
  barColor: string;
  hasLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  suggestions: string[];
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      score: 0,
      label: 'Very Weak',
      color: 'text-red-400',
      barColor: 'bg-red-500',
      hasLength: false,
      hasUpper: false,
      hasLower: false,
      hasNumber: false,
      hasSymbol: false,
      suggestions: ['Enter at least 12 characters with mixed characters.'],
    };
  }

  const length = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const hasLength = length >= 12;

  let score = 0;

  // Length contribution (up to 40 points)
  if (length >= 20) score += 40;
  else if (length >= 16) score += 35;
  else if (length >= 12) score += 25;
  else if (length >= 8) score += 15;
  else score += length * 1.5;

  // Character class variety (up to 40 points)
  let varieties = 0;
  if (hasUpper) varieties++;
  if (hasLower) varieties++;
  if (hasNumber) varieties++;
  if (hasSymbol) varieties++;

  score += varieties * 10;

  // Bonus for combination of symbols + numbers + mixed case
  if (varieties >= 4 && length >= 14) score += 20;
  else if (varieties >= 3 && length >= 12) score += 10;

  // Penalties for repetitive characters
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
  }
  // Penalty for simple number sequence
  if (/(123|234|345|456|567|678|789|012)/.test(password)) {
    score -= 10;
  }

  score = Math.max(5, Math.min(100, Math.round(score)));

  const suggestions: string[] = [];
  if (length < 12) suggestions.push('Increase length to at least 12 characters.');
  if (!hasUpper) suggestions.push('Add uppercase letters (A-Z).');
  if (!hasLower) suggestions.push('Add lowercase letters (a-z).');
  if (!hasNumber) suggestions.push('Add numeric digits (0-9).');
  if (!hasSymbol) suggestions.push('Add symbols and punctuation (!@#$%).');

  let label: PasswordStrengthResult['label'] = 'Very Weak';
  let color = 'text-red-400';
  let barColor = 'bg-red-500';

  if (score >= 85) {
    label = 'Very Strong';
    color = 'text-emerald-400';
    barColor = 'bg-emerald-500';
  } else if (score >= 70) {
    label = 'Strong';
    color = 'text-blue-400';
    barColor = 'bg-blue-500';
  } else if (score >= 50) {
    label = 'Fair';
    color = 'text-amber-400';
    barColor = 'bg-amber-500';
  } else if (score >= 30) {
    label = 'Weak';
    color = 'text-orange-400';
    barColor = 'bg-orange-500';
  }

  return {
    score,
    label,
    color,
    barColor,
    hasLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSymbol,
    suggestions,
  };
}
