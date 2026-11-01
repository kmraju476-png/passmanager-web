export type VaultCategory =
  | 'Social Media'
  | 'Gaming'
  | 'Banking'
  | 'Work'
  | 'Entertainment'
  | 'Shopping'
  | 'Other';

export interface VaultItem {
  id: string;
  title: string;
  url: string;
  username: string;
  password: string;
  category: VaultCategory;
  notes?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  strengthScore: number; // 0-100
  folder?: string;
}

export interface CreateVaultItemDto {
  title: string;
  url: string;
  username: string;
  password: string;
  category: VaultCategory;
  notes?: string;
  isFavorite?: boolean;
  folder?: string;
}

export interface UpdateVaultItemDto extends Partial<CreateVaultItemDto> {
  id: string;
}

export type VaultSortOption = 'title-asc' | 'title-desc' | 'updated-desc' | 'created-desc';
