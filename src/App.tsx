/**
 * PassForge — Professional Password Manager Web Application
 * Complete Frontend Architecture ready for ASP.NET Core Web API + PostgreSQL
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useVault } from './hooks/useVault';
import { useToast } from './hooks/useToast';
import { VaultItem, CreateVaultItemDto, UpdateVaultItemDto, VaultCategory } from './types/vault';

// Layout components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';
import { Modal } from './components/common/Modal';
import { Button } from './components/common/Button';
import { LockKeyhole, UserRoundPlus } from 'lucide-react';
import { authService } from './services/authService';
import { supabase } from './supabaseClient';

// 11 Required Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { VaultPage } from './pages/VaultPage';
import { AddPasswordPage } from './pages/AddPasswordPage';
import { EditPasswordPage } from './pages/EditPasswordPage';
import { GeneratorPage } from './pages/GeneratorPage';
import { SecurityCenterPage } from './pages/SecurityCenterPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';

const AUTH_REQUIRED_PAGES = new Set([
  'dashboard',
  'vault',
  'add-password',
  'edit-password',
  'security',
  'settings',
  'profile',
]);

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(null);
  const [authenticatedUserName, setAuthenticatedUserName] = useState<string | null>(null);
  const [vaultUnlock, setVaultUnlock] = useState<{ userId: string; key: CryptoKey } | null>(null);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [pendingProtectedPage, setPendingProtectedPage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);

  const { toasts, showToast, removeToast } = useToast();
  const vaultKey =
    vaultUnlock && vaultUnlock.userId === authenticatedUserId ? vaultUnlock.key : null;
  const handleVaultError = useCallback(
    (error: unknown) => {
      showToast({
        title: 'Unable to load your vault',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    },
    [showToast]
  );

  const {
    items,
    filteredItems,
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
  } = useVault(vaultKey, handleVaultError);

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Supabase Auth] Session event', {
        event,
        hasSession: Boolean(session),
      });
      setIsAuthenticated(Boolean(session?.user));
      setAuthenticatedUserId(session?.user.id ?? null);
      const fullName = session?.user.user_metadata?.full_name;
      const alternateName = session?.user.user_metadata?.name;
      const metadataName =
        typeof fullName === 'string' && fullName.trim()
          ? fullName.trim()
          : typeof alternateName === 'string' && alternateName.trim()
            ? alternateName.trim()
            : null;
      setAuthenticatedUserName(
        metadataName ?? session?.user.email ?? null
      );
      setVaultUnlock((current) => (current?.userId === session?.user.id ? current : null));
      if (event === 'SIGNED_OUT') {
        setCurrentPage('landing');
        setPendingProtectedPage(null);
        setAuthenticatedUserName(null);
      } else if (
        session?.user &&
        (event === 'INITIAL_SESSION' || event === 'SIGNED_IN')
      ) {
        setCurrentPage((page) =>
          page === 'landing' || page === 'register' ? 'login' : page
        );
        setAuthPromptOpen(false);
      }
    });

    authService.getCurrentUser()
      .then((user) => {
        if (active) {
          setIsAuthenticated(Boolean(user));
          setAuthenticatedUserId(user?.id ?? null);
          setAuthenticatedUserName(user?.fullName ?? null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          showToast({
            title: 'Unable to restore session',
            description: error instanceof Error ? error.message : 'Please log in again.',
            type: 'error',
          });
        }
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [showToast]);

  // Check URL query parameters for ?autostart=1 or ?page=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedPage = params.get('page');

    if (requestedPage) {
      if (AUTH_REQUIRED_PAGES.has(requestedPage)) {
        setPendingProtectedPage(requestedPage);
        setAuthPromptOpen(true);
      } else {
        setCurrentPage(requestedPage);
      }
    }
  }, []);

  const handleNavigate = useCallback(
    (page: string) => {
      if ((!isAuthenticated || !vaultKey) && AUTH_REQUIRED_PAGES.has(page)) {
        setPendingProtectedPage(page);
        setAuthPromptOpen(true);
        setMobileMenuOpen(false);
        return;
      }

      setCurrentPage(page);
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [isAuthenticated, vaultKey]
  );

  const completeAuthentication = useCallback(
    (fallbackPage: string, userId: string, key: CryptoKey, fullName: string) => {
      setIsAuthenticated(true);
      setAuthenticatedUserId(userId);
      setAuthenticatedUserName(fullName);
      setVaultUnlock({ userId, key });
      setAuthPromptOpen(false);
      setCurrentPage(pendingProtectedPage ?? fallbackPage);
      setPendingProtectedPage(null);
    },
    [pendingProtectedPage]
  );

  const handleSignOut = useCallback(async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setAuthenticatedUserId(null);
      setAuthenticatedUserName(null);
      setVaultUnlock(null);
      setPendingProtectedPage(null);
      setAuthPromptOpen(false);
      setCurrentPage('landing');
    } catch (error) {
      showToast({
        title: 'Unable to sign out',
        description: error instanceof Error ? error.message : 'Please try again.',
        type: 'error',
      });
    }
  }, [showToast]);

  const handleCopyPassword = useCallback(
    async (password: string) => {
      try {
        await navigator.clipboard.writeText(password);
        showToast({
          title: 'Password copied to clipboard',
          description: 'Memory will be automatically cleared according to security policy.',
          type: 'success',
          duration: 3500,
        });
      } catch {
        showToast({
          title: 'Copy failed',
          description: 'Please grant clipboard permissions to copy passwords.',
          type: 'error',
        });
      }
    },
    [showToast]
  );

  const handleCopyUsername = useCallback(
    async (username: string) => {
      try {
        await navigator.clipboard.writeText(username);
        showToast({
          title: 'Username copied',
          description: username,
          type: 'info',
          duration: 2500,
        });
      } catch {
        showToast({
          title: 'Copy failed',
          type: 'error',
        });
      }
    },
    [showToast]
  );

  const handleEditItem = useCallback(
    (item: VaultItem) => {
      setEditingItem(item);
      handleNavigate('edit-password');
    },
    [handleNavigate]
  );

  const handleSaveNewItem = useCallback(
    async (dto: CreateVaultItemDto) => {
      try {
        const created = await addItem(dto);
        showToast({
          title: 'Credential saved',
          description: `${created.title} added to your encrypted vault.`,
          type: 'success',
        });
        handleNavigate('vault');
      } catch (error) {
        showToast({
          title: 'Unable to save credential',
          description: error instanceof Error ? error.message : 'Please try again.',
          type: 'error',
        });
      }
    },
    [addItem, showToast, handleNavigate]
  );

  const handleSaveUpdatedItem = useCallback(
    async (dto: UpdateVaultItemDto) => {
      try {
        const updated = await updateItem(dto);
        showToast({
          title: 'Credential updated',
          description: `Changes to ${updated.title} have been saved.`,
          type: 'success',
        });
        setEditingItem(null);
        handleNavigate('vault');
      } catch (error) {
        showToast({
          title: 'Unable to update credential',
          description: error instanceof Error ? error.message : 'Please try again.',
          type: 'error',
        });
      }
    },
    [updateItem, showToast, handleNavigate]
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      const target = items.find((i) => i.id === id);
      try {
        const deleted = await deleteItem(id);
        if (!deleted) throw new Error('The credential was not found in your vault.');
        showToast({
          title: 'Credential deleted',
          description: target ? `${target.title} removed from vault.` : 'Item deleted.',
          type: 'info',
        });
        if (currentPage === 'edit-password') {
          setEditingItem(null);
          handleNavigate('vault');
        }
      } catch (error) {
        showToast({
          title: 'Unable to delete credential',
          description: error instanceof Error ? error.message : 'Please try again.',
          type: 'error',
        });
      }
    },
    [deleteItem, items, currentPage, showToast, handleNavigate]
  );

  const handleToggleFavorite = useCallback(
    async (id: string) => {
      try {
        const updated = await toggleFavorite(id);
        showToast({
          title: updated.isFavorite ? 'Added to favorites' : 'Removed from favorites',
          description: updated.title,
          type: 'info',
          duration: 2000,
        });
      } catch (error) {
        showToast({
          title: 'Unable to update favorite',
          description: error instanceof Error ? error.message : 'Please try again.',
          type: 'error',
        });
      }
    },
    [toggleFavorite, showToast]
  );

  const authPrompt = (
    <Modal
      isOpen={authPromptOpen}
      onClose={() => {
        setAuthPromptOpen(false);
        setPendingProtectedPage(null);
      }}
      title="Sign in to continue"
      description={
        isAuthenticated
          ? 'Your account is signed in. Enter your master password to unlock your encrypted vault.'
          : 'Create an account or sign in to unlock your encrypted vault.'
      }
      maxWidth="sm"
    >
      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          leftIcon={<LockKeyhole className="w-4 h-4" />}
          className="w-full"
          onClick={() => {
            setAuthPromptOpen(false);
            setCurrentPage('login');
          }}
        >
          {isAuthenticated ? 'Unlock your vault' : 'Log in to your vault'}
        </Button>
        {!isAuthenticated && (
          <Button
            variant="secondary"
            size="lg"
            leftIcon={<UserRoundPlus className="w-4 h-4" />}
            className="w-full"
            onClick={() => {
              setAuthPromptOpen(false);
              setCurrentPage('register');
            }}
          >
            Create a new account
          </Button>
        )}
      </div>
    </Modal>
  );

  // Render standalone public pages (Landing, Login, Register)
  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage onNavigate={handleNavigate} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
        {authPrompt}
      </>
    );
  }

  if (currentPage === 'login') {
    return (
      <>
        <LoginPage
          onNavigate={handleNavigate}
          onLoginSuccess={(userId, user, key, fullName) => {
            showToast({
              title: 'Vault unlocked',
              description: `Welcome, ${user}.`,
              type: 'success',
            });
            completeAuthentication('vault', userId, key, fullName);
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  if (currentPage === 'register') {
    return (
      <>
        <RegisterPage
          onNavigate={handleNavigate}
          onRegisterSuccess={(userId, key, fullName) => {
            showToast({
              title: 'Master vault created',
              description: 'Emergency kit prepared. Welcome to PassForge.',
              type: 'success',
            });
            completeAuthentication('dashboard', userId, key, fullName);
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // Authenticated Dashboard App Shell (Dashboard, Vault, Add, Edit, Generator, Security, Settings, Profile)
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSignOut={handleSignOut}
        vaultCount={items.length}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onSignOut={handleSignOut}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onSearchClick={() => {
            handleNavigate('vault');
          }}
        />

        {/* Dynamic Page Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <DashboardPage
              items={items}
              isAuthenticated={isAuthenticated}
              userName={authenticatedUserName ?? undefined}
              onNavigate={handleNavigate}
              onEditItem={handleEditItem}
              onCopyPassword={handleCopyPassword}
              onCopyUsername={handleCopyUsername}
              onSelectCategoryFilter={(cat: VaultCategory) => {
                setSelectedCategory(cat);
              }}
            />
          )}

          {currentPage === 'vault' && (
            <VaultPage
              items={items}
              filteredItems={filteredItems}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onlyFavorites={onlyFavorites}
              sortOption={sortOption}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              onToggleFavoritesFilter={() => setOnlyFavorites(!onlyFavorites)}
              onSortChange={setSortOption}
              onNavigate={handleNavigate}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onToggleFavorite={handleToggleFavorite}
              onCopyPassword={handleCopyPassword}
              onCopyUsername={handleCopyUsername}
            />
          )}

          {currentPage === 'add-password' && (
            <AddPasswordPage
              onSave={handleSaveNewItem}
              onCancel={() => handleNavigate('vault')}
            />
          )}

          {currentPage === 'edit-password' && (
            <EditPasswordPage
              item={editingItem || items[0]}
              onSave={handleSaveUpdatedItem}
              onDelete={handleDeleteItem}
              onCancel={() => handleNavigate('vault')}
            />
          )}

          {currentPage === 'generator' && (
            <GeneratorPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'security' && (
            <SecurityCenterPage
              items={items}
              onEditItem={handleEditItem}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              onShowToast={(title, desc, type) =>
                showToast({ title, description: desc, type: type || 'success' })
              }
            />
          )}

          {currentPage === 'profile' && (
            <ProfilePage
              onNavigate={handleNavigate}
              onShowToast={(title, desc, type) =>
                showToast({ title, description: desc, type: type || 'success' })
              }
            />
          )}
        </main>

        {/* Subtle Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Global Toast Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      {authPrompt}
    </div>
  );
}
