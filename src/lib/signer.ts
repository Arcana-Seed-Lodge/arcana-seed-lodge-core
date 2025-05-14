import { HDKey }         from '@scure/bip32'
import { p2pkh }         from '@scure/btc-signer'
import { assert_exists } from './util.js'

interface SignerConfig {
  index   : number,
  network : string
}

export class SeedSigner {

  private readonly _mstr    : HDKey
  private readonly _acct    : HDKey
  private readonly _network : string
  private readonly _path    : string
  
  private _index : number

  constructor (
    seed    : Uint8Array,
    options : Partial<SignerConfig> = {}
  ) {
    this._mstr    = HDKey.fromMasterSeed(seed)
    this._index   = options.index   ?? 0
    this._network = options.network ?? 'regtest'
    this._path    = `m/84'/0'/0'`
    this._acct    = this._mstr.derive(this._path)

  }

  get account_xpub () {
    return this._acct.publicExtendedKey
  }

  get spend_address () {
    try {
      // Use m/0/index for BIP84 spend address
      const fullPath = `m/0/${this._index}`
      // Derive from master seed to ensure proper path format
      const xprv = this._mstr.derive(`${this._path}/0/${this._index}`)
      assert_exists(xprv.publicKey)
      return p2pkh(xprv.publicKey)
    } catch (error) {
      console.error("Error in spend_address:", error);
      throw error;
    }
  }

  get change_address () {
    try {
      // Use m/1/index for BIP84 change address
      const fullPath = `m/1/${this._index}`
      // Derive from master seed to ensure proper path format
      const xprv = this._mstr.derive(`${this._path}/1/${this._index}`)
      assert_exists(xprv.publicKey)
      return p2pkh(xprv.publicKey)
    } catch (error) {
      console.error("Error in change_address:", error);
      throw error;
    }
  }

  get wallet_index () {
    return this._index
  }

  set_index (index? : number) {
    this._index = index ?? this._index + 1
  }

  decode_psbt (psbt : string) {
    return
  }

  sign_psbt (psbt : string) {
    return
  }
}