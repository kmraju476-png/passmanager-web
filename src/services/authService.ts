import { UserProfile, LoginCredentials, RegisterCredentials, AuthSession } from '../types/auth';
import { getSupabaseClient } from '../supabaseClient';

export interface IAuthService {
  getCurrentUser(): Promise<UserProfile | null>;
  login(credentials: LoginCredentials): Promise<AuthSession>;
  register(credentials: RegisterCredentials): Promise<AuthSession | null>;
  logout(): Promise<void>;
  updateProfile(profile: Partial<UserProfile>): Promise<UserProfile>;
}

function toUserProfile(user: {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
}): UserProfile {
  const metadataName =
    typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : typeof user.user_metadata?.name === 'string' && user.user_metadata.name.trim()
        ? user.user_metadata.name.trim()
        : null;

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: metadataName ?? user.email ?? 'PassForge User',
    createdAt: user.created_at ?? new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    twoFactorEnabled: false,
    activeSessionsCount: 1,
  };
}

function toAuthSession(session: {
  access_token: string;
  expires_at?: number;
  user: Parameters<typeof toUserProfile>[0];
}): AuthSession {
  return {
    token: session.access_token,
    user: toUserProfile(session.user),
    expiresAt: session.expires_at
      ? new Date(session.expires_at * 1000).toISOString()
      : new Date(Date.now() + 3600000).toISOString(),
  };
}

class SupabaseAuthService implements IAuthService {
  async getCurrentUser(): Promise<UserProfile | null> {
    const { data, error } = await getSupabaseClient().auth.getSession();
    if (error) throw error;
    return data.session ? toUserProfile(data.session.user) : null;
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({
      email: credentials.email.trim(),
      password: credentials.masterPassword,
    });
    if (error) {
      console.error('[Supabase Auth] signInWithPassword failed:', error);
      throw error;
    }
    if (!data.session) throw new Error('Supabase did not return a login session.');
    return toAuthSession(data.session);
  }

  async register(credentials: RegisterCredentials): Promise<AuthSession | null> {
    const { data, error } = await getSupabaseClient().auth.signUp({
      email: credentials.email,
      password: credentials.masterPassword,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: credentials.fullName.trim(),
          name: credentials.fullName.trim(),
          enable_biometrics: credentials.enableBiometrics ?? false,
        },
      },
    });
    if (error) throw error;
    return data.session ? toAuthSession(data.session) : null;
  }

  async logout(): Promise<void> {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw error;
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await getSupabaseClient().auth.updateUser({
      data: profile.fullName
        ? { full_name: profile.fullName.trim(), name: profile.fullName.trim() }
        : undefined,
      email: profile.email,
    });
    if (error) throw error;
    return toUserProfile(data.user);
  }
}

export const authService = new SupabaseAuthService();
