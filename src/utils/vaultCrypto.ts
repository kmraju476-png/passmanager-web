const KDF_ITERATIONS = 600_000;
const encoder = new TextEncoder();

export type VaultEntryPayload = {
  title: string;
  url: string;
  username: string;
  password: string;
  category: string;
  notes: string;
  isFavorite: boolean;
  folder: string;
};

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

export async function deriveVaultKey(masterPassword: string, userId: string): Promise<CryptoKey> {
  if (!masterPassword || !userId) {
    throw new Error('A master password and authenticated user are required to unlock the vault.');
  }

  const material = await crypto.subtle.importKey(
    'raw',
    encoder.encode(masterPassword),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(`PassForge vault v1:${userId}`),
      iterations: KDF_ITERATIONS,
      hash: 'SHA-256',
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptVaultEntry(
  key: CryptoKey,
  payload: VaultEntryPayload
): Promise<{ encrypted_data: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(JSON.stringify(payload))
  );

  return {
    encrypted_data: bytesToBase64(new Uint8Array(ciphertext)),
    iv: bytesToBase64(iv),
  };
}

export async function decryptVaultEntry(
  key: CryptoKey,
  encryptedData: string,
  encodedIv: string
): Promise<VaultEntryPayload> {
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(base64ToBytes(encodedIv)) },
    key,
    toArrayBuffer(base64ToBytes(encryptedData))
  );
  const value: unknown = JSON.parse(new TextDecoder().decode(plaintext));

  if (
    typeof value !== 'object' ||
    value === null ||
    !('title' in value) ||
    typeof value.title !== 'string' ||
    !('url' in value) ||
    typeof value.url !== 'string' ||
    !('username' in value) ||
    typeof value.username !== 'string' ||
    !('password' in value) ||
    typeof value.password !== 'string' ||
    !('category' in value) ||
    typeof value.category !== 'string' ||
    !('notes' in value) ||
    typeof value.notes !== 'string' ||
    !('isFavorite' in value) ||
    typeof value.isFavorite !== 'boolean' ||
    !('folder' in value) ||
    typeof value.folder !== 'string'
  ) {
    throw new Error('Vault entry data is invalid or could not be decrypted.');
  }

  return {
    title: value.title,
    url: value.url,
    username: value.username,
    password: value.password,
    category: value.category,
    notes: value.notes,
    isFavorite: value.isFavorite,
    folder: value.folder,
  };
}
