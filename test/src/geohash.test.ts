import { Test }              from 'tape'
import { generate_map_seed } from '@/lib/hash.js'
import { SYMBOLS }           from '@/symbols.js'
import { hex }               from '@scure/base'

const TARGET = '09E8DE8FCABB855E6433CD33941674DD16E559AB13E8550EB25A0ADD50FFAFDFF401D2D6844FEEBA4598D9B494C9F0771C45EF3021F6F24FF267A8A95F88646B'

const test_geohashes = [
  'dp3wqdh', //B15 - End of Navy Pier
  '9v6e6nk', //B16 - Circuit of the Americas Grand Plaza Entrance
  '9q8yyk8', //B17 - SVN West in SF
  'dhx48x9', //B21/22/23 Miami Beach Convention Center
  'dn6m9q3', //B24 - Nashville Music City Center	 
  '9qqj7pz' //B25 - The Venetian Vegas
]

const test_symbols = [
  SYMBOLS[1],  // 👁️ All-Seeing Eye
  SYMBOLS[2],  // 🐝 Beehive
  SYMBOLS[5],  // 🗿 Pillar Jachin
  SYMBOLS[6],  // 🪨 Pillar Boaz
]

export function test_geohash (t : Test) {
  t.plan(1)

  const seed = generate_map_seed(test_geohashes, test_symbols)
  
  const hex_string = hex.encode(seed)
  const seed_hex   = hex_string.toUpperCase()

  t.equal(seed_hex, TARGET, 'should equal hash of input')
}
