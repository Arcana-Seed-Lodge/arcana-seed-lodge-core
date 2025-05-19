import { hexToBytes } from '@noble/hashes/utils'
import { SeedSigner } from '../src/lib/signer.js'

const hex    = '09e8de8fcabb855e6433cd33941674dd16e559ab13e8550eb25a0add50ffafdff401d2d6844feeba4598d9b494c9f0771c45ef3021f6f24ff267a8a95f88646b'
const seed   = hexToBytes(hex)
const signer = new SeedSigner(seed, { network: 'regtest' })

const psbt = 'cHNidP8BAHECAAAAAf3Ym8f2G2eH5pI82+HLyJKEFxW/Tm3h5h/Ij7kyM3C2AAAAAAD9////AqAPAAAAAAAAFgAUCUf5wXJcqickCp+uIVwuZUcqMG5EAgAAAAAAABYAFA6LW10+Dwke/JUtw2Pug2xKsW+SAAAAAE8BBIiyHgNRAFOtgAAAAOaF7laytY2p3zKkXziTOkh8Qmc5M7czGJKNFJ/kc4xbAh3FJKCmuFeIj98xxOhkdZFvnv4w94Gym86zL3hScOrHEDShAsNUAACAAAAAgAAAAIAAAQB9AgAAAAGyBW3KsYURa5Mcs4C6OnokMfbgJJqpHgy0noT5hZpCjwAAAAAA/f///wKIEwAAAAAAABYAFPc6nONlFJMydRny5iAI316I4ZcSbeixAQAAAAAiACClLtvVaLpoDQESPyUPsYKULRzjs1XXeN9kdRgPQbxsvrexDQABAR+IEwAAAAAAABYAFPc6nONlFJMydRny5iAI316I4ZcSAQMEAQAAACIGApXJgB5VFROvsYWk/qMU+Sy/x/v1/sd1aQKkq77824z+GDShAsNUAACAAAAAgAAAAIAAAAAAAAAAAAAAIgID+qq+dU+6egJiBN/IAwZ2qebTQT6OsM1BoV9cZWNfhuMYNKECw1QAAIAAAACAAAAAgAEAAAAAAAAAAA=='

const result = signer.decode_psbt(psbt)
console.log(result)

const signed = signer.sign_psbt(psbt)

console.log(signed)
