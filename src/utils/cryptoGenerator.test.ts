import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSecurePassword,
  calculateEntropy,
  generatePassphrase,
} from './cryptoGenerator.ts';
import { evaluatePasswordStrength } from './passwordStrength.ts';

test('generateSecurePassword generates expected length and character sets', () => {
  const pwd = generateSecurePassword({
    length: 24,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false,
  });

  assert.equal(pwd.length, 24);
  assert.match(pwd, /[A-Z]/, 'should contain uppercase');
  assert.match(pwd, /[a-z]/, 'should contain lowercase');
  assert.match(pwd, /[0-9]/, 'should contain numbers');
  assert.match(pwd, /[^A-Za-z0-9]/, 'should contain symbols');
});

test('generateSecurePassword excludes ambiguous characters when requested', () => {
  const pwd = generateSecurePassword({
    length: 50,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
    excludeAmbiguous: true,
  });

  assert.equal(pwd.length, 50);
  assert.equal(/[0Oo1lI|]/.test(pwd), false, 'should not contain ambiguous characters');
});

test('calculateEntropy returns higher bits for complex passwords', () => {
  const lowEntropy = calculateEntropy('simple');
  const highEntropy = calculateEntropy('Kx9#mQ2$pL9@vR8!');

  assert.ok(highEntropy > lowEntropy);
  assert.ok(highEntropy >= 80);
});

test('generatePassphrase returns hyphen-delimited words with a number', () => {
  const phrase = generatePassphrase(4, '-');
  const parts = phrase.split('-');
  assert.equal(parts.length, 5); // 4 words + 1 trailing number
  assert.match(parts[4], /^\d+$/);
});

test('evaluatePasswordStrength properly grades passwords', () => {
  const weak = evaluatePasswordStrength('123456');
  assert.equal(weak.label, 'Very Weak');
  assert.ok(weak.score < 30);

  const strong = evaluatePasswordStrength('J8#kL9!mQ2$pX7@wZ4%');
  assert.ok(strong.score >= 85);
  assert.equal(strong.label, 'Very Strong');
  assert.equal(strong.hasLength, true);
  assert.equal(strong.hasUpper, true);
  assert.equal(strong.hasLower, true);
  assert.equal(strong.hasNumber, true);
  assert.equal(strong.hasSymbol, true);
});
