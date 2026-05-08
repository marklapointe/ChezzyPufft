export interface EmbyWebUIConfig {
  apiUrl: string;
  wsUrl?: string;
  language?: string;
  theme?: 'light' | 'dark';
  clientId?: string;
}

const DEFAULT_CONFIG: EmbyWebUIConfig = {
  apiUrl: 'http://localhost:8096',
  language: 'en-US',
  theme: 'dark'
};

const STORAGE_KEY = 'chezzypufft-config';

function generateClientId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function loadConfig(): EmbyWebUIConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch {
  }
  return { ...DEFAULT_CONFIG };
}

function saveConfig(config: EmbyWebUIConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
  }
}

class ConfigService {
  private config: EmbyWebUIConfig;

  constructor() {
    this.config = loadConfig();
    if (!this.config.clientId) {
      this.config.clientId = generateClientId();
      saveConfig(this.config);
    }
  }

  get(): Readonly<EmbyWebUIConfig> {
    return this.config;
  }

  getApiUrl(): string {
    return this.config.apiUrl;
  }

  getWsUrl(): string {
    if (this.config.wsUrl) {
      return this.config.wsUrl;
    }
    const apiUrl = this.config.apiUrl;
    return apiUrl.replace(/^http/, 'ws').replace(/\/+$/, '') + '/socket';
  }

  getLanguage(): string {
    return this.config.language || 'en-US';
  }

  getTheme(): 'light' | 'dark' {
    return this.config.theme || 'dark';
  }

  getClientId(): string {
    return this.config.clientId || generateClientId();
  }

  setApiUrl(url: string): void {
    this.config = { ...this.config, apiUrl: url };
    saveConfig(this.config);
  }

  setWsUrl(url: string): void {
    this.config = { ...this.config, wsUrl: url };
    saveConfig(this.config);
  }

  setLanguage(lang: string): void {
    this.config = { ...this.config, language: lang };
    saveConfig(this.config);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.config = { ...this.config, theme };
    saveConfig(this.config);
  }

  reload(): void {
    this.config = loadConfig();
  }
}

let configInstance: ConfigService | null = null;

export function getConfig(): ConfigService {
  if (!configInstance) {
    configInstance = new ConfigService();
  }
  return configInstance;
}
