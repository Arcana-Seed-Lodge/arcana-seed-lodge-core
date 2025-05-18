import { Store } from 'tauri-plugin-store-api';

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
  private store: StorageProvider = {} as StorageProvider;
  private static instance: StorageService;
  private isTauri: boolean;
  private tauriStore: Store | null = null;
  private readonly storePath = 'arcana-seed.dat';

  private constructor() {
    // Check if we're in a Tauri environment
    this.isTauri = typeof window !== 'undefined' && 
                 window !== undefined && 
                 // @ts-ignore
                 window.__TAURI__ !== undefined;
    
    if (this.isTauri) {
      try {
        // Initialize the Tauri store
        this.tauriStore = new Store(this.storePath);
        
        this.store = {
          get: async (key: string): Promise<any> => {
            try {
              if (this.tauriStore) {
                return await this.tauriStore.get(key);
              }
              return null;
            } catch (e) {
              console.error('Error getting data from Tauri store:', e);
              return null;
            }
          },
          set: async (key: string, value: any): Promise<void> => {
            try {
              if (this.tauriStore) {
                await this.tauriStore.set(key, value);
              }
            } catch (e) {
              console.error('Error setting data in Tauri store:', e);
            }
          },
          save: async (): Promise<void> => {
            try {
              if (this.tauriStore) {
                await this.tauriStore.save();
              }
            } catch (e) {
              console.error('Error saving Tauri store:', e);
            }
          }
        };
      } catch (e) {
        console.error('Error initializing Tauri store, falling back to localStorage:', e);
        this.fallbackToLocalStorage();
      }
    } else {
      this.fallbackToLocalStorage();
    }
  }

  private fallbackToLocalStorage() {
    // Fallback to localStorage
    console.warn('Tauri API unavailable, falling back to localStorage');
    this.store = new LocalStorageFallback('arcana-seed');
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
      await this.store.save(); // Explicitly save after setting value
    }
  }

  async saveSymbols(symbols: any[]): Promise<void> {
    await this.store.set('symbols', symbols);
    if (this.store.save) {
      await this.store.save(); // Explicitly save after setting value
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