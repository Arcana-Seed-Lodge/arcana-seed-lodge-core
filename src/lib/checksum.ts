/**
 * Implementation of BIP-380 descriptor checksum algorithm
 * @see https://github.com/bitcoin/bips/blob/master/bip-0380.mediawiki
 */

const INPUT_CHARSET = "0123456789()[],'/*abcdefgh@:$%{}IJKLMNOPQRSTUVWXYZ&+-.;<=>?!^_|~ijklmnopqrstuvwxyzABCDEFGH`#\"\\ ";
const CHECKSUM_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const GENERATOR = [0xf5dee51989, 0xa9fdca3312, 0x1bab10e32d, 0x3706b1677a, 0x644d626ffd];

/**
 * Internal function that computes the descriptor checksum
 * @param symbols Array of symbol values
 * @returns The checksum value
 */
function descsumPolymod(symbols: number[]): number {
    let chk = 1;
    for (const value of symbols) {
        const top = chk >> 35;
        chk = ((chk & 0x7ffffffff) << 5) ^ value;
        for (let i = 0; i < 5; i++) {
            chk ^= ((top >> i) & 1) ? GENERATOR[i] : 0;
        }
    }
    return chk;
}

/**
 * Internal function that does the character to symbol expansion
 * @param s Input string to expand
 * @returns Array of symbol values or null if invalid input
 */
function descsumExpand(s: string): number[] | null {
    const groups: number[] = [];
    const symbols: number[] = [];
    
    for (const c of s) {
        const index = INPUT_CHARSET.indexOf(c);
        if (index === -1) {
            return null;
        }
        
        symbols.push(index & 31);
        groups.push(index >> 5);
        
        if (groups.length === 3) {
            symbols.push(groups[0] * 9 + groups[1] * 3 + groups[2]);
            groups.length = 0;
        }
    }
    
    if (groups.length === 1) {
        symbols.push(groups[0]);
    } else if (groups.length === 2) {
        symbols.push(groups[0] * 3 + groups[1]);
    }
    
    return symbols;
}

/**
 * Verify that the checksum is correct in a descriptor
 * @param s Descriptor string with checksum
 * @returns True if checksum is valid, false otherwise
 */
export function descsumCheck(s: string): boolean {
    if (s.length < 9 || s[s.length - 9] !== '#') {
        return false;
    }
    
    const checksum = s.slice(-8);
    if (![...checksum].every(x => CHECKSUM_CHARSET.includes(x))) {
        return false;
    }
    
    const symbols = descsumExpand(s.slice(0, -9));
    if (!symbols) {
        return false;
    }
    
    const checksumSymbols = [...checksum].map(x => CHECKSUM_CHARSET.indexOf(x));
    return descsumPolymod([...symbols, ...checksumSymbols]) === 1;
}

/**
 * Add a checksum to a descriptor
 * @param s Descriptor string without checksum
 * @returns Descriptor string with checksum
 */
export function add_checksum(s: string): string {
    const symbols = descsumExpand(s);
    if (!symbols) {
        throw new Error('Invalid descriptor string');
    }
    
    const checksum = descsumPolymod([...symbols, 0, 0, 0, 0, 0, 0, 0, 0]) ^ 1;
    const checksumStr = Array.from({ length: 8 }, (_, i) => 
        CHECKSUM_CHARSET[(checksum >> (5 * (7 - i))) & 31]
    ).join('');
    
    return `${s}#${checksumStr}`;
} 