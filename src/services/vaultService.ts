import { getSupabaseClient } from '../supabaseClient';
import { CreateVaultItemDto, UpdateVaultItemDto, VaultCategory, VaultItem } from '../types/vault';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import {
  decryptVaultEntry,
  encryptVaultEntry,
  VaultEntryPayload,
} from '../utils/vaultCrypto';

const VAULT_COLUMNS = 'id, user_id, encrypted_data, iv, crypto_version, created_at, updated_at';
const VAULT_CATEGORIES: VaultCategory[] = [
  'Social Media',
  'Gaming',
  'Banking',
  'Work',
  'Entertainment',
  'Shopping',
  'Other',
];

interface VaultEntryRow {
  id: string;
  user_id: string;
  encrypted_data: string;
  iv: string;
  crypto_version: number;
  created_at: string;
  updated_at: string;
}

export interface IVaultService {
  getAll(key: CryptoKey): Promise<VaultItem[]>;
  getById(id: string, key: CryptoKey): Promise<VaultItem | undefined>;
  create(dto: CreateVaultItemDto, key: CryptoKey): Promise<VaultItem>;
  update(dto: UpdateVaultItemDto, key: CryptoKey): Promise<VaultItem>;
  delete(id: string): Promise<boolean>;
  toggleFavorite(id: string, key: CryptoKey): Promise<VaultItem>;
}

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await getSupabaseClient().auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('You must be signed in to access your vault.');
  return data.user.id;
}

function toPayload(item: Pick<
  VaultItem,
  'title' | 'url' | 'username' | 'password' | 'category' | 'notes' | 'isFavorite' | 'folder'
>): VaultEntryPayload {
  return {
    title: item.title,
    url: item.url,
    username: item.username,
    password: item.password,
    category: item.category,
    notes: item.notes ?? '',
    isFavorite: item.isFavorite,
    folder: item.folder ?? 'Default',
  };
}

async function fromRow(row: VaultEntryRow, key: CryptoKey): Promise<VaultItem> {
  if (row.crypto_version !== 1) {
    throw new Error(`Vault entry ${row.id} uses an unsupported encryption version.`);
  }

  const payload = await decryptVaultEntry(key, row.encrypted_data, row.iv);
  if (!VAULT_CATEGORIES.includes(payload.category as VaultCategory)) {
    throw new Error(`Vault entry ${row.id} has an unsupported category.`);
  }

  return {
    id: row.id,
    ...payload,
    category: payload.category as VaultCategory,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    strengthScore: evaluatePasswordStrength(payload.password).score,
  };
}

async function readItem(id: string, userId: string, key: CryptoKey): Promise<VaultItem | undefined> {
  const { data, error } = await getSupabaseClient()
    .from('vault_entries')
    .select(VAULT_COLUMNS)
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as VaultEntryRow, key) : undefined;
}

class SupabaseVaultService implements IVaultService {
  async getAll(key: CryptoKey): Promise<VaultItem[]> {
    const userId = await getCurrentUserId();
    const { data, error } = await getSupabaseClient()
      .from('vault_entries')
      .select(VAULT_COLUMNS)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return Promise.all((data as VaultEntryRow[]).map((row) => fromRow(row, key)));
  }

  async getById(id: string, key: CryptoKey): Promise<VaultItem | undefined> {
    return readItem(id, await getCurrentUserId(), key);
  }

  async create(dto: CreateVaultItemDto, key: CryptoKey): Promise<VaultItem> {
    const userId = await getCurrentUserId();
    const encrypted = await encryptVaultEntry(key, toPayload({
      ...dto,
      notes: dto.notes ?? '',
      isFavorite: dto.isFavorite ?? false,
      folder: dto.folder ?? 'Default',
    }));

    const { data, error } = await getSupabaseClient()
      .from('vault_entries')
      .insert({ user_id: userId, ...encrypted, crypto_version: 1 })
      .select(VAULT_COLUMNS)
      .single();

    if (error) throw error;
    return fromRow(data as VaultEntryRow, key);
  }

  async update(dto: UpdateVaultItemDto, key: CryptoKey): Promise<VaultItem> {
    const userId = await getCurrentUserId();
    const current = await readItem(dto.id, userId, key);
    if (!current) throw new Error(`Vault item with ID ${dto.id} was not found.`);

    const updatedPayload = toPayload({ ...current, ...dto });
    const encrypted = await encryptVaultEntry(key, updatedPayload);
    const { data, error } = await getSupabaseClient()
      .from('vault_entries')
      .update({ ...encrypted, crypto_version: 1 })
      .eq('id', dto.id)
      .eq('user_id', userId)
      .select(VAULT_COLUMNS)
      .single();

    if (error) throw error;
    return fromRow(data as VaultEntryRow, key);
  }

  async delete(id: string): Promise<boolean> {
    const userId = await getCurrentUserId();
    const { data, error } = await getSupabaseClient()
      .from('vault_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('id');

    if (error) throw error;
    return data.length > 0;
  }

  async toggleFavorite(id: string, key: CryptoKey): Promise<VaultItem> {
    const current = await this.getById(id, key);
    if (!current) throw new Error(`Vault item with ID ${id} was not found.`);
    return this.update({ id, isFavorite: !current.isFavorite }, key);
  }
}

export const vaultService = new SupabaseVaultService();
