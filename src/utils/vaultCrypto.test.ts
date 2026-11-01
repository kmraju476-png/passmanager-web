import test from 'node:test';
import assert from 'node:assert/strict';
import { decryptVaultEntry, deriveVaultKey, encryptVaultEntry } from './vaultCrypto.ts';

test('vault entries are encrypted and can only be decrypted with the derived key', async () => {
  const key = await deriveVaultKey('correct horse battery staple', 'user-123');
  const payload = {
    title: 'Private account',
    url: 'https://example.com',
    username: 'private-user',
    password: 'a-secret-password',
    category: 'Work',
    notes: 'private notes',
    isFavorite: true,
    folder: 'Personal',
  };

  const encrypted = await encryptVaultEntry(key, payload);
  assert.notEqual(encrypted.encrypted_data, JSON.stringify(payload));
  assert.equal(encrypted.encrypted_data.includes(payload.password), false);
  assert.equal(encrypted.iv.length > 0, true);
  assert.deepEqual(await decryptVaultEntry(key, encrypted.encrypted_data, encrypted.iv), payload);

  const changedCiphertext = `${encrypted.encrypted_data[0] === 'A' ? 'B' : 'A'}${encrypted.encrypted_data.slice(1)}`;
  await assert.rejects(decryptVaultEntry(key, changedCiphertext, encrypted.iv));
});

test('vault key derivation is scoped to the Supabase user', async () => {
  const firstUserKey = await deriveVaultKey('same master password', 'user-123');
  const secondUserKey = await deriveVaultKey('same master password', 'user-456');
  const encrypted = await encryptVaultEntry(firstUserKey, {
    title: 'Private account',
    url: '',
    username: 'private-user',
    password: 'a-secret-password',
    category: 'Work',
    notes: '',
    isFavorite: false,
    folder: 'Default',
  });

  await assert.rejects(
    decryptVaultEntry(secondUserKey, encrypted.encrypted_data, encrypted.iv)
  );
});
