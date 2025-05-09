import { sha256 } from '@noble/hashes/sha256';

// 32-symbol set from entropy-guidelines.md
const SYMBOLS = [
  '🜃', // Square & Compass
  '👁️', // All-Seeing Eye
  '🐝', // Beehive
  '🧱', // Trowel
  '🔨', // Gavel
  '🗿', // Pillar Jachin
  '🪨', // Pillar Boaz
  '☀️', // Sun
  '🌙', // Moon
  '☠️', // Skull & Crossbones
  '❤️', // Heart
  '⚓', // Anchor
  '🛶', // Ark
  '🪜', // Ladder
  '🌿', // Acacia Branch
  '🌟', // Blazing Star
  '📜', // Book of Constitutions
  '📏', // Level
  '🧭', // Plumb Line
  '🪨', // Rough Ashlar
  '🧱', // Perfect Ashlar
  '📐', // 47th Problem of Euclid
  '🔪', // Scythe
  '⏳', // Hourglass
  '🗡️', // Sword
  '🐍', // Snake
  '🐢', // Turtle
  '🐎', // Horse
  '🦃', // Turkey
  '🌘', // Crescent Moon
  '✝️', // Cross
  '🐝', // Bee (repeated for dual-symbol UI)
];

export class GenerateSeedLogic {
  private geohashes: string[];
  private symbols: string[];
  private seedHex: string;

  constructor() {
    // Hardcoded geohashes and 4 symbols from the SYMBOLS set
    this.geohashes = [
      'dp3wqdh', //B15 - End of Navy Pier
      '9v6e6nk', //B16 - Circuit of the Americas Grand Plaza Entrance
      '9q8yyk8', //B17 - SVN West in SF
      'dhx48x9', //B21/22/23 Miami Beach Convention Center
      'dn6m9q3', //B24 - Nashville Music City Center	 
      '9qqj7pz' //B25 - The Venetian Vegas
    ];
    this.symbols = [
      SYMBOLS[1],  // 👁️ All-Seeing Eye
      SYMBOLS[2],  // 🐝 Beehive
      SYMBOLS[5],  // 🗿 Pillar Jachin
      SYMBOLS[6],  // 🪨 Pillar Boaz
    ];
    this.seedHex = this.generateSeedHex();
  }

  private generateSeedHex(): string {
    const input = [...this.geohashes, ...this.symbols].join('-');
    const hash = sha256(new TextEncoder().encode(input));
    return Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  public getSeedHex(): string {
    return this.seedHex;
  }

  public getSymbols(): string[] {
    return this.symbols;
  }
} 