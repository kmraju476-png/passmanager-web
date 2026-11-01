/**
 * PassForge API Client Architecture
 * Prepared for future ASP.NET Core Web API + PostgreSQL integration.
 *
 * Future backend endpoints will map to:
 * - POST /api/v1/auth/register (Argon2id master password hash)
 * - POST /api/v1/auth/login (JWT Bearer Token)
 * - GET  /api/v1/vault/items (AES-256-GCM client-encrypted blobs)
 * - POST /api/v1/vault/items
 * - PUT  /api/v1/vault/items/{id}
 * - DELETE /api/v1/vault/items/{id}
 * - GET  /api/v1/security/audit
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export class ApiError extends Error {
  statusCode: number;
  errors?: string[];

  constructor(message: string, statusCode: number = 500, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Configurable base URL for when ASP.NET Core Web API is running on localhost or cloud
export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) ||
  'https://localhost:7124/api/v1';

let authToken: string | null = null;

export const apiClient = {
  setToken(token: string | null) {
    authToken = token;
  },

  getToken(): string | null {
    return authToken;
  },

  getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  },
};
