import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { VaultItem, VaultCategory, CreateVaultItemDto, UpdateVaultItemDto, VaultSortOption } from '../types/vault';
import { vaultService } from '../services/vaultService';

export function useVault(vaultKey: CryptoKey | null, onError?: (error: unknown) => void) {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<VaultCategory | 'All'>('All');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<VaultSortOption>('updated-desc');
  const vaultKeyRef = useRef(vaultKey);
  const fetchRequestRef = useRef(0);
  vaultKeyRef.current = vaultKey;

  const fetchItems = useCallback(async () => {
    const requestId = ++fetchRequestRef.current;
    if (!vaultKey) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await vaultService.getAll(vaultKey);
      if (fetchRequestRef.current === requestId && vaultKeyRef.current === vaultKey) {
        setItems(data);
      }
    } catch (error) {
      if (fetchRequestRef.current === requestId && vaultKeyRef.current === vaultKey) {
        setItems([]);
        onError?.(error);
      }
    } finally {
      if (fetchRequestRef.current === requestId) setLoading(false);
    }
  }, [vaultKey, onError]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (dto: CreateVaultItemDto) => {
    if (!vaultKey) throw new Error('Unlock your vault before adding an entry.');
    const created = await vaultService.create(dto, vaultKey);
    if (vaultKeyRef.current === vaultKey) setItems((prev) => [created, ...prev]);
    return created;
  }, [vaultKey]);

  const updateItem = useCallback(async (dto: UpdateVaultItemDto) => {
    if (!vaultKey) throw new Error('Unlock your vault before updating an entry.');
    const updated = await vaultService.update(dto, vaultKey);
    if (vaultKeyRef.current === vaultKey) {
      setItems((prev) => prev.map((item) => (item.id === dto.id ? updated : item)));
    }
    return updated;
  }, [vaultKey]);

  const deleteItem = useCallback(async (id: string) => {
    if (!vaultKey) throw new Error('Unlock your vault before deleting an entry.');
    const success = await vaultService.delete(id);
    if (success && vaultKeyRef.current === vaultKey) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
    return success;
  }, [vaultKey]);

  const toggleFavorite = useCallback(async (id: string) => {
    if (!vaultKey) throw new Error('Unlock your vault before changing an entry.');
    const updated = await vaultService.toggleFavorite(id, vaultKey);
    if (vaultKeyRef.current === vaultKey) {
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    }
    return updated;
  }, [vaultKey]);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }
        // Favorite filter
        if (onlyFavorites && !item.isFavorite) {
          return false;
        }
        // Search query filter (title, url, username, notes)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchUrl = item.url.toLowerCase().includes(q);
          const matchUsername = item.username.toLowerCase().includes(q);
          const matchNotes = (item.notes || '').toLowerCase().includes(q);
          return matchTitle || matchUrl || matchUsername || matchNotes;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'title-asc') return a.title.localeCompare(b.title);
        if (sortOption === 'title-desc') return b.title.localeCompare(a.title);
        if (sortOption === 'created-desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // 'updated-desc' default
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [items, selectedCategory, onlyFavorites, searchQuery, sortOption]);

  const stats = useMemo(() => {
    const total = items.length;
    const favorites = items.filter((i) => i.isFavorite).length;
    const weak = items.filter((i) => i.strengthScore < 50).length;
    const strong = items.filter((i) => i.strengthScore >= 75).length;
    return { total, favorites, weak, strong };
  }, [items]);

  return {
    items,
    filteredItems,
    loading,
    stats,
    searchQuery,
    selectedCategory,
    onlyFavorites,
    sortOption,
    setSearchQuery,
    setSelectedCategory,
    setOnlyFavorites,
    setSortOption,
    addItem,
    updateItem,
    deleteItem,
    toggleFavorite,
    refreshItems: fetchItems,
  };
}
