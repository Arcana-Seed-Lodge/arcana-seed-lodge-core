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
    const path = `0/${this._index}`
    const xprv = this._acct.derive(path)
    assert_exists(xprv.publicKey)
    return p2pkh(xprv.publicKey)
  }

  get change_address () {
    const path = `1/${this._index}`
    const xprv = this._acct.derive(path)
    assert_exists(xprv.publicKey)
    return p2pkh(xprv.publicKey)
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