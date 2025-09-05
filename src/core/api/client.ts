import NetInfo from '@react-native-community/netinfo';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV({id: 'api-cache'});
const syncQueue = new MMKV({id: 'sync-queue'});

interface ApiConfig {
  baseURL: string;
  timeout?: number;
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  offline?: {
    enabled?: boolean;
    cacheKey?: string;
    ttl?: number; // Time to live in ms
  };
}

interface SyncQueueItem {
  id: string;
  endpoint: string;
  config: RequestConfig;
  timestamp: number;
  retries: number;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private token: string | null = null;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000;
  }

  setAuthToken(token: string | null) {
    this.token = token;
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const isOnline = await this.checkConnection();
    
    // Check if we should use offline mode
    if (!isOnline && config.offline?.enabled) {
      return this.handleOfflineRequest<T>(endpoint, config);
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: config.method || 'GET',
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache successful GET requests if offline mode is enabled
      if (config.method === 'GET' && config.offline?.cacheKey) {
        this.cacheData(config.offline.cacheKey, data, config.offline.ttl);
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // If offline and it's a mutation, add to sync queue
      if (!isOnline && config.method !== 'GET') {
        this.addToSyncQueue(endpoint, config);
      }
      
      throw error;
    }
  }

  private async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  private handleOfflineRequest<T>(
    endpoint: string,
    config: RequestConfig,
  ): T {
    if (config.method === 'GET' && config.offline?.cacheKey) {
      const cached = this.getCachedData<T>(config.offline.cacheKey);
      if (cached) {
        return cached;
      }
    }

    // For mutations, add to sync queue
    if (config.method !== 'GET') {
      this.addToSyncQueue(endpoint, config);
      // Return optimistic response
      return {} as T;
    }

    throw new Error('No cached data available');
  }

  private cacheData(key: string, data: any, ttl?: number) {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || 1000 * 60 * 5, // Default 5 minutes
    };
    storage.set(key, JSON.stringify(cacheEntry));
  }

  private getCachedData<T>(key: string): T | null {
    const cached = storage.getString(key);
    if (!cached) return null;

    try {
      const entry = JSON.parse(cached);
      const isExpired = Date.now() - entry.timestamp > entry.ttl;
      
      if (isExpired) {
        storage.delete(key);
        return null;
      }
      
      return entry.data;
    } catch {
      return null;
    }
  }

  private addToSyncQueue(endpoint: string, config: RequestConfig) {
    const item: SyncQueueItem = {
      id: `${Date.now()}-${Math.random()}`,
      endpoint,
      config,
      timestamp: Date.now(),
      retries: 0,
    };
    
    const queue = this.getSyncQueue();
    queue.push(item);
    syncQueue.set('queue', JSON.stringify(queue));
  }

  private getSyncQueue(): SyncQueueItem[] {
    const queueStr = syncQueue.getString('queue');
    if (!queueStr) return [];
    
    try {
      return JSON.parse(queueStr);
    } catch {
      return [];
    }
  }

  async processSyncQueue() {
    const isOnline = await this.checkConnection();
    if (!isOnline) return;

    const queue = this.getSyncQueue();
    const processed: string[] = [];

    for (const item of queue) {
      try {
        await this.request(item.endpoint, item.config);
        processed.push(item.id);
      } catch (error) {
        console.error(`Failed to sync ${item.endpoint}:`, error);
        // Increment retry count
        item.retries++;
        if (item.retries > 3) {
          // Remove after 3 retries
          processed.push(item.id);
        }
      }
    }

    // Update queue
    const remainingQueue = queue.filter(
      (item) => !processed.includes(item.id),
    );
    syncQueue.set('queue', JSON.stringify(remainingQueue));
  }

  // Convenience methods
  get<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, {...config, method: 'GET'});
  }

  post<T>(endpoint: string, body?: any, config?: RequestConfig) {
    return this.request<T>(endpoint, {...config, method: 'POST', body});
  }

  put<T>(endpoint: string, body?: any, config?: RequestConfig) {
    return this.request<T>(endpoint, {...config, method: 'PUT', body});
  }

  delete<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, {...config, method: 'DELETE'});
  }
}

// Create singleton instance
const apiClient = new ApiClient({
  baseURL: __DEV__ 
    ? 'http://localhost:5040/api'
    : 'https://api.glucoplate.com/api',
});

export default apiClient;