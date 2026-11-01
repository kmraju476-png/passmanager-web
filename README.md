# PassForge

PassForge is a React + Vite password-manager interface with Supabase email/password authentication.

## Run locally

**Prerequisites:** Node.js and npm

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set your Supabase project URL and anon key:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. In Supabase, enable email/password authentication. If email confirmation is enabled, users must confirm their email before they can log in.
4. Start the development server:
   ```sh
   npm run dev
   ```

The app restores the Supabase auth session on startup and supports registration, login, and logout. Without Supabase environment variables, authentication displays a configuration error.

## Supabase vault setup

1. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql) to create the encrypted vault table and per-user Row Level Security policies.
2. Register or log in through PassForge. Use the same master password for sign-in and vault encryption.
3. Keep your master password safe. The encryption key is derived in the browser with PBKDF2-SHA-256 and used with AES-256-GCM. It stays in memory and is cleared on sign-out; after a page reload, sign in again to unlock the vault.

Vault entry contents (including site, username, password, notes, category, and favorite state) are encrypted before being sent to Supabase. The database stores ciphertext, its random initialization vector, owner ID, and timestamps. Supabase Row Level Security restricts access to the signed-in owner. PassForge cannot recover entries if you lose the master password.

The Supabase sign-in password also derives the vault encryption key. Do not change or reset that password until vault-key migration is implemented; otherwise existing entries cannot be decrypted.
