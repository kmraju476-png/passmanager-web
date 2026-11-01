import { AppSettings } from '../types/settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  autoLockMinutes: 15,
  clearClipboardSeconds: 30,
  maskPasswordsByDefault: true,
  biometricPromptEnabled: true,
  twoFactorAuthEnabled: true,
  notifyOnWeakPassword: true,
  auditFrequencyDays: 7,
};

class SettingsService {
  private settings: AppSettings = { ...DEFAULT_SETTINGS };

  getSettings(): AppSettings {
    return { ...this.settings };
  }

  updateSettings(partial: Partial<AppSettings>): AppSettings {
    this.settings = {
      ...this.settings,
      ...partial,
    };
    return { ...this.settings };
  }

  resetDefaults(): AppSettings {
    this.settings = { ...DEFAULT_SETTINGS };
    return { ...this.settings };
  }
}

export const settingsService = new SettingsService();
