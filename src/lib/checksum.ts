const INPUT_CHARSET    : string = "0123456789()[],'/*abcdefgh@:$%{}IJKLMNOPQRSTUVWXYZ&+-.;<=>?!^_|~ijklmnopqrstuvwxyzABCDEFGH`#\"\\ "
const CHECKSUM_CHARSET : string = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"

const GENERATOR: bigint[] = [
  BigInt(0xf5dee51989),
  BigInt(0xa9fdca3312),
  BigInt(0x1bab10e32d),
  BigInt(0x3706b1677a),
  BigInt(0x644d626ffd)
]

function polymod_symbols(symbols: number[]): bigint {
  let chk: bigint = BigInt(1)
  for (const value of symbols) {
    const top: bigint = chk >> BigInt(35)
    chk = ((chk & BigInt(0x7ffffffff)) << BigInt(5)) ^ BigInt(value)
    for (let i = 0; i < 5; i++) {
      chk ^= ((top >> BigInt(i)) & BigInt(1)) ? GENERATOR[i] : BigInt(0)
    }
  }
  return chk
}

function expand_symbols(s: string): number[] | null {
  const groups: number[] = []
  const symbols: number[] = []
  for (const c of s) {
    const v: number = INPUT_CHARSET.indexOf(c)
    if (v === -1) {
      return null
    }
    symbols.push(v & 31)
    groups.push(v >> 5)
    if (groups.length === 3) {
      symbols.push(groups[0] * 9 + groups[1] * 3 + groups[2])
      groups.length = 0
    }
  }
  if (groups.length === 1) {
    symbols.push(groups[0])
  } else if (groups.length === 2) {
    symbols.push(groups[0] * 3 + groups[1])
  }
  return symbols
}

export function verify_checksum (s: string): boolean {
  if (s[s.length - 9] !== '#') {
    return false
  }
  const checksumPart: string = s.slice(-8)
  if (![...checksumPart].every(x => CHECKSUM_CHARSET.includes(x))) {
    return false
  }
  const symbols: number[] | null = expand_symbols(s.slice(0, -9))
  if (symbols === null) {
    return false
  }
  const checksumSymbols: number[] = [...checksumPart].map(x => CHECKSUM_CHARSET.indexOf(x))
  return polymod_symbols(symbols.concat(checksumSymbols)) === BigInt(1)
}

export function get_checksum (s: string): string {
  const symbols: number[] | null = expand_symbols(s)
  if (symbols === null) {
    throw new Error('Invalid characters in descriptor')
  }
  const checksumSymbols: number[] = symbols.concat([0, 0, 0, 0, 0, 0, 0, 0])
  const checksum: bigint = polymod_symbols(checksumSymbols) ^ BigInt(1)
  let result: string = ''
  for (let i = 0; i < 8; i++) {
    result += CHECKSUM_CHARSET[Number((checksum >> BigInt(5 * (7 - i))) & BigInt(31))]
  }
  return result
}