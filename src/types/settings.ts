export interface AppSettings {
  theme: 'dark' | 'amoled';
  autoLockMinutes: number; // 0 = disabled, 1, 5, 15, 30, 60
  clearClipboardSeconds: number; // 0 = never, 15, 30, 60, 120
  maskPasswordsByDefault: boolean;
  biometricPromptEnabled: boolean;
  twoFactorAuthEnabled: boolean;
  notifyOnWeakPassword: boolean;
  auditFrequencyDays: number;
}
