import { get_checksum } from '../src/lib/checksum.js'

const key_descriptor = 'wpkh([34a102c3/84h/0h/0h]xpub6CFJPLavEUpbmhSsihixZ3BLuWiALj1tyt59kW8mNV44j5VYjXU9S9AzAFcqwvZXZhemHFbFhzviF7rgvhcT3sBWEDZE9g2i7rDb3LjjeES/<0;1>/*)'

const target_key_checksum = 'lh26753l'

const key_checksum = get_checksum(key_descriptor)

console.log('\nKey Descriptor Results:')
console.log('computed checksum:', key_checksum)
console.log('target checksum:', target_key_checksum)
console.log('match:', key_checksum === target_key_checksum)

const raw_descriptor      = 'raw(deadbeef)'
const target_raw_checksum = '89f8spxm'
const raw_checksum        = get_checksum(raw_descriptor)

console.log('\nRaw Descriptor Results:')
console.log('computed checksum:', raw_checksum)
console.log('target checksum:', target_raw_checksum)
console.log('match:', raw_checksum === target_raw_checksum)
