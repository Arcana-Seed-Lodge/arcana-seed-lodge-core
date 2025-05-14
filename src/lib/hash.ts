import { pbkdf2 }        from '@noble/hashes/pbkdf2'
import { sha256 }        from '@noble/hashes/sha2'
import { assert_exists } from './util.js'

export function generate_map_seed (
  geohashes : string[],
  symbols   : string[]
) {
  const text_string = geohashes.join('') + symbols.join('')
  const text_bytes  = new TextEncoder().encode(text_string)
  assert_exists(text_bytes)
  return pbkdf2(sha256, text_bytes, 'seed', { dkLen: 64, c: 2048 })
}
