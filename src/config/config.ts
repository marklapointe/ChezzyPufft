import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export interface EmbyWebUIConfig {
  apiUrl: string;
  wsUrl?: string;
  language?: string;
  theme?: 'light' | 'dark';
}

const DEFAULT_CONFIG: EmbyWebUIConfig = {
  apiUrl: 'http://localhost:8096',
  language: 'en-US',
  theme: 'dark'
};

function getConfigPath(): string | null {
  const xdgConfigHome = process.env.XDG_CONFIG_HOME;
  const home = process.env.HOME || process.env.USERPROFILE;

  if (xdgConfigHome) {
    return join(xdgConfigHome, 'chezzypufft', 'config.json');
  }

  if (home) {
    const linuxPath = join(home, '.config', 'chezzypufft', 'config.json');
    if (existsSync(linuxPath)) {
      return linuxPath;
    }
  }

  const freebsdPath = '/usr/local/etc/chezzypufft/config.json';
  if (existsSync(freebsdPath)) {
    return freebsdPath;
  }

  return null;
}

function loadConfigFromFile(): EmbyWebUIConfig {
  const configPath = getConfigPath();

  if (!configPath || !existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(content);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CONFIG;
  }
}

class ConfigService {
  private config: EmbyWebUIConfig;

  constructor() {
    this.config = loadConfigFromFile();
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

  setApiUrl(url: string): void {
    this.config = { ...this.config, apiUrl: url };
  }

  setWsUrl(url: string): void {
    this.config = { ...this.config, wsUrl: url };
  }

  setLanguage(lang: string): void {
    this.config = { ...this.config, language: lang };
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.config = { ...this.config, theme };
  }

  reload(): void {
    this.config = loadConfigFromFile();
  }
}

let configInstance: ConfigService | null = null;

export function getConfig(): ConfigService {
  if (!configInstance) {
    configInstance = new ConfigService();
  }
  return configInstance;
}
