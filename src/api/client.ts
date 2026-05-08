import type { User, ServerInfo, SessionInfo } from './types';

interface ConnectionManager {
  servers: ServerInfo[];
  currentServer: ServerInfo | null;
  addServer(server: ServerInfo): void;
  removeServer(serverId: string): void;
  getServer(serverId: string): ServerInfo | null;
}

interface ApiClient {
  getUser(userId: string): Promise<User>;
  getCurrentUser(): Promise<User>;
  getServers(): Promise<ServerInfo[]>;
  getSessions(): Promise<SessionInfo[]>;
  getItem(itemId: string): Promise<unknown>;
  getItems(options: GetItemsOptions): Promise<ItemsResult>;
}

interface GetItemsOptions {
  userId?: string;
  parentId?: string;
  searchTerm?: string;
  types?: string[];
  includeMediaTypes?: string[];
  sortBy?: string;
  sortOrder?: 'Ascending' | 'Descending';
  limit?: number;
  startIndex?: number;
}

interface ItemsResult {
  Items: unknown[];
  TotalRecordCount: number;
  StartIndex: number;
}

type ServerRole = 'emby' | 'embyConnect' | 'manual';

export class EmbyApiClient implements ApiClient, ConnectionManager {
  servers: ServerInfo[] = [];
  currentServer: ServerInfo | null = null;
  private accessToken: string | null = null;
  private serverUrl: string = '';

  constructor() {
    this.servers = [];
    this.currentServer = null;
  }

  setServerInfo(url: string, accessToken: string): void {
    this.serverUrl = url.replace(/\/$/, '');
    this.accessToken = accessToken;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.serverUrl}/emby${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken && { 'X-MediaBrowser-Token': this.accessToken }),
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async getUser(userId: string): Promise<User> {
    return this.request<User>(`/Users/${userId}`);
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/Users/Me');
  }

  async getServers(): Promise<ServerInfo[]> {
    return this.servers;
  }

  async getSessions(): Promise<SessionInfo[]> {
    return this.request<SessionInfo[]>('/Sessions');
  }

  async getItem(itemId: string): Promise<unknown> {
    return this.request(`/Items/${itemId}`);
  }

  async getItems(options: GetItemsOptions = {}): Promise<ItemsResult> {
    const params = new URLSearchParams();
    if (options.userId) params.append('UserId', options.userId);
    if (options.parentId) params.append('ParentId', options.parentId);
    if (options.searchTerm) params.append('SearchTerm', options.searchTerm);
    if (options.types?.length) params.append('IncludeItemTypes', options.types.join(','));
    if (options.includeMediaTypes?.length) params.append('IncludeMediaTypes', options.includeMediaTypes.join(','));
    if (options.sortBy?.length) params.append('SortBy', options.sortBy.join(','));
    if (options.sortOrder) params.append('SortOrder', options.sortOrder);
    if (options.limit) params.append('Limit', options.limit.toString());
    if (options.startIndex) params.append('StartIndex', options.startIndex.toString());

    return this.request<ItemsResult>(`/Items?${params.toString()}`);
  }

  addServer(server: ServerInfo): void {
    this.servers.push(server);
  }

  removeServer(serverId: string): void {
    this.servers = this.servers.filter((s) => s.Id !== serverId);
  }

  getServer(serverId: string): ServerInfo | null {
    return this.servers.find((s) => s.Id === serverId) || null;
  }
}

let apiClientInstance: EmbyApiClient | null = null;

export function getApiClient(): EmbyApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new EmbyApiClient();
  }
  return apiClientInstance;
}
