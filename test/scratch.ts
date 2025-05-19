import { get_checksum } from '../src/lib/checksum.js'

const key_descriptor = '[deadbeef/0h/1h/2h]xpub6ERApfZwUNrhLCkDtcHTcxd75RbzS1ed54G1LkBUHQVHQKqhMkhgbmJbZRkrgZw4koxb5JaHWkY4ALHY2grBGRjaDMzQLcgJvLJuZZvRcEL/<0;1>/*'

const key_checksum = get_checksum(key_descriptor)

console.log('\nKey Descriptor Results:')
console.log(key_descriptor + '#' + key_checksum)
