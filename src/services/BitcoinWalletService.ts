import { SeedSigner } from "../lib/signer";
import { generate_map_seed } from "../lib/hash";
import { StorageService } from "./StorageService";
import { SYMBOLS } from "../symbols";

export class BitcoinWalletService {
  private storageService: StorageService;
  private signer: SeedSigner | null = null;
  private _xpub: string = "";

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  async initialize(): Promise<void> {
    try {
      const geohashes = await this.storageService.getGeohashes();
      const symbols = await this.storageService.getSymbols();
      
      if (geohashes.length > 0) {
        // If symbols aren't stored, use some defaults
        const symbolsToUse = symbols.length > 0 ? symbols : [
          SYMBOLS[1], SYMBOLS[2], SYMBOLS[5], SYMBOLS[6]
        ];
        
        const seed = generate_map_seed(geohashes, symbolsToUse);
        this.signer = new SeedSigner(seed, {network: 'test'});
        this._xpub = this.signer.account_xpub;
      }
    } catch (error) {
      console.error("Error initializing wallet service:", error);
      throw error;
    }
  }

  get isInitialized(): boolean {
    return this.signer !== null;
  }

  get account_descriptor(): string {
    return this.signer?.account_descriptor || "";
  }

  get xpub(): string {
    return this._xpub;
  }

  get signerInstance(): SeedSigner | null {
    return this.signer;
  }
} 