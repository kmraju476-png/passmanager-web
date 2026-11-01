export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt: string;
  twoFactorEnabled: boolean;
  activeSessionsCount: number;
}

export interface LoginCredentials {
  email: string;
  masterPassword: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  masterPassword: string;
  confirmPassword: string;
  enableBiometrics?: boolean;
  hint?: string;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
  expiresAt: string;
}
