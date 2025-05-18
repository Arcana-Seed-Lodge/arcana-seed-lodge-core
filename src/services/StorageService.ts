import { invoke } from '@tauri-apps/api/tauri';

// Local storage fallback for when Tauri API isn't available
class LocalStorageFallback {
  private storeName: string;

  constructor(storeName: string) {
    this.storeName = storeName;
  }

  async get(key: string): Promise<any> {
    const storeData = localStorage.getItem(this.storeName);
    if (!storeData) return null;
    
    try {
      const parsedData = JSON.parse(storeData);
      return parsedData[key];
    } catch (e) {
      console.error('Error parsing localStorage data:', e);
      return null;
    }
  }

  async set(key: string, value: any): Promise<void> {
    let storeData = {};
    const existingData = localStorage.getItem(this.storeName);
    
    if (existingData) {
      try {
        storeData = JSON.parse(existingData);
      } catch (e) {
        console.error('Error parsing existing localStorage data:', e);
      }
    }
    
    storeData = { ...storeData, [key]: value };
    localStorage.setItem(this.storeName, JSON.stringify(storeData));
  }

  async save(): Promise<void> {
    // No-op for localStorage as it's immediately saved
  }
}

// Interface for our storage providers
interface StorageProvider {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  save?(): Promise<void>;
}

export class StorageService {
  private store: StorageProvider;
  private static instance: StorageService;
  private isTauri: boolean;

  private constructor() {
    // Check if we're in a Tauri environment
    this.isTauri = typeof window !== 'undefined' && 
                 window !== undefined && 
                 // @ts-ignore
                 window.__TAURI__ !== undefined;
    
    if (this.isTauri) {
      this.store = {
        async get(key: string): Promise<any> {
          try {
            // Use Tauri's invoke to get data
            const result = await invoke('plugin:store|get', { 
              key,
              store: 'arcana-seed.dat'
            });
            return result;
          } catch (e) {
            console.error('Error getting data from Tauri store:', e);
            return null;
          }
        },
        async set(key: string, value: any): Promise<void> {
          try {
            // Use Tauri's invoke to set data
            await invoke('plugin:store|set', {
              key,
              value,
              store: 'arcana-seed.dat'
            });
          } catch (e) {
            console.error('Error setting data in Tauri store:', e);
          }
        },
        async save(): Promise<void> {
          try {
            // Use Tauri's invoke to save the store
            await invoke('plugin:store|save', {
              store: 'arcana-seed.dat'
            });
          } catch (e) {
            console.error('Error saving Tauri store:', e);
          }
        }
      };
    } else {
      // Fallback to localStorage
      console.warn('Tauri API unavailable, falling back to localStorage');
      this.store = new LocalStorageFallback('arcana-seed');
    }
  }

  // Singleton pattern
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async saveGeohashes(geohashes: string[]): Promise<void> {
    await this.store.set('geohashes', geohashes);
    if (this.store.save) {
      await this.store.save();
    }
  }

  async saveSymbols(symbols: any[]): Promise<void> {
    await this.store.set('symbols', symbols);
    if (this.store.save) {
      await this.store.save();
    }
  }

  async getGeohashes(): Promise<string[]> {
    return await this.store.get('geohashes') as string[] || [];
  }

  async getSymbols(): Promise<any[]> {
    return await this.store.get('symbols') as any[] || [];
  }

  async hasStoredWallet(): Promise<boolean> {
    const geohashes = await this.getGeohashes();
    return geohashes.length > 0;
  }
} 