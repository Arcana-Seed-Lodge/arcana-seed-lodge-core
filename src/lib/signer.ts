import { HDKey }        from '@scure/bip32'
import { base64, hex }  from '@scure/base'
import { hexToBytes }   from '@noble/hashes/utils.js'
import { get_checksum } from './checksum.js'
import { HD_DATA }      from '../const.js'

import { Address, p2wpkh, Transaction } from '@scure/btc-signer'

import {
  assert_exists,
  assert_size,
  is_base64_str,
  is_hex_str
} from './util.js'

import type { BTC_NETWORK } from '@scure/btc-signer/utils.js'

interface SignerConfig {
  index     : number,
  path      : string,
  network   : 'main' | 'test' | 'regtest',
  gap_limit : number
}

interface PSBTResult {
  spend_address    : string,
  spend_amount     : number,
  recv_address     : string,
  recv_amount      : number,
  change_address   : string,
  change_amount    : number,
  tx_fee           : number
}

interface KeyInput {
  seckey : Uint8Array,
  pubkey : Uint8Array
}

export class SeedSigner {

  private readonly _mstr      : HDKey
  private readonly _acct      : HDKey
  private readonly _network   : BTC_NETWORK
  private readonly _path      : string
  private readonly _gap_limit : number

  private _index : number

  constructor (
    seed    : Uint8Array,
    options : Partial<SignerConfig> = {}
  ) {
    this._mstr      = HDKey.fromMasterSeed(seed)
    this._index     = options.index   ?? 0
    this._gap_limit = options.gap_limit ?? 10
    this._network   = parse_network(options.network ?? 'main')
    this._path      = options.path ?? `m/84'/0'/0'`
    this._acct      = this._mstr.derive(this._path)
  }

  get account_xpub () {
    return this._acct.publicExtendedKey
  }

  get account_descriptor () {
    const mprint   = this._mstr.fingerprint.toString(16).padStart(8, '0')
    const mpath    = this._path.replace('m', '').replaceAll('\'', 'h')
    const desc     = `wpkh([${mprint}${mpath}]${this.account_xpub}/<0;1>/*)`
    const checksum = get_checksum(desc)
    return `${desc}#${checksum}`
  }

  get scan_limit () {
    return this._index + this._gap_limit
  }

  get recv_address () {
    try {
      // Derive from master seed to ensure proper path format
      const xprv = this._mstr.derive(`${this._path}/0/${this._index}`)
      assert_exists(xprv.publicKey)
      return p2wpkh(xprv.publicKey, this._network)
    } catch (error) {
      console.error("Error in recv_address:", error);
      throw error;
    }
  }

  get wallet_index () {
    return this._index
  }

  resolve_key (
    account_type : 'spend' | 'change',
    pubkey_hash  : Uint8Array
  ) : KeyInput | null {
    assert_size(pubkey_hash, 20, 'invalid pubkey hash size')
    const target_pkh = hex.encode(pubkey_hash)
    const type_idx  = account_type === 'spend' ? 0 : 1
    for (let i = 0; i < this.scan_limit; i++) {
      const spend_key = this._acct.derive(`${type_idx}/${i}`)
      if (!spend_key.pubKeyHash) continue
      const spend_pkh = hex.encode(spend_key.pubKeyHash)
      if (spend_pkh === target_pkh) {
        const seckey = spend_key.privateKey!
        const pubkey = spend_key.publicKey!
        return { seckey, pubkey }
      }
    }
    return null
  }

  set_index (index? : number) {
    this._index = index ?? this._index + 1
  }

  decode_psbt (psbt : string) : PSBTResult {
    const pbytes = decode_psbt_str(psbt)
    const pdata  = Transaction.fromPSBT(pbytes)
    const spend_vin   = pdata.getInput(0)
    const recv_vout   = pdata.getOutput(0)
    const change_vout = pdata.getOutput(1)
    const spend_utxo  = spend_vin.witnessUtxo
    assert_exists(spend_utxo, 'spending utxo is not defined for the spend input')
    const spend_pkh   = spend_utxo.script.slice(2)
    assert_size(spend_pkh, 20,  'unable to parse spending pubkey hash')
    const spend_keys = this.resolve_key('spend', spend_pkh)
    assert_exists(spend_keys, 'spending utxo is not owned by the signer')
    const recv_script = recv_vout.script
    assert_exists(recv_script, 'receiving utxo is not defined for the receive output')
    const recv_pkh    = recv_script.slice(2)
    assert_size(recv_pkh, 20, 'unable to parse receiving pubkey hash')
    const change_script = change_vout.script
    assert_exists(change_script, 'change utxo is not defined for the change input')
    const change_pkh    = change_script.slice(2)
    assert_size(change_pkh, 20, 'unable to parse change pubkey hash')
    const change_keys = this.resolve_key('change', change_pkh)
    assert_exists(change_keys, 'change utxo is not owned by the signer')
    assert_exists(recv_vout.amount,   'receiving utxo amount is not defined')
    assert_exists(change_vout.amount, 'change utxo amount is not defined')
    const spend_amount    = Number(spend_utxo.amount)
    const recv_amount     = Number(recv_vout.amount)
    const change_amount   = Number(change_vout.amount)
    const tx_fee          = Number(pdata.fee)

    return {
      spend_address  : Address(this._network).encode({ type: 'wpkh', hash: spend_pkh }),
      spend_amount,
      recv_address   : Address(this._network).encode({ type: 'wpkh', hash: recv_pkh }),
      recv_amount,
      change_address : Address(this._network).encode({ type: 'wpkh', hash: change_pkh }),
      change_amount,
      tx_fee
    }
  }

  sign_psbt (psbt : string) {
    const pbytes     = decode_psbt_str(psbt)
    const pdata      = Transaction.fromPSBT(pbytes)
    const spend_vin  = pdata.getInput(0)
    const spend_utxo = spend_vin.witnessUtxo
    assert_exists(spend_utxo, 'spending utxo is not defined for the spend input')
    const spend_pkh  = spend_utxo.script.slice(2)
    const spend_keys = this.resolve_key('spend', spend_pkh)
    assert_exists(spend_keys, 'spending utxo is not owned by the signer')
    pdata.sign(spend_keys.seckey)
    pdata.finalize()
    return pdata.toPSBT()
  }
}

function decode_psbt_str (psbt : string) : Uint8Array {
  if (is_hex_str(psbt)) {
    return hexToBytes(psbt)
  }
  if (is_base64_str(psbt)) {
    return base64.decode(psbt)
  }
  throw new Error('invalid PSBT encoding')
}

function parse_network (network : string) : BTC_NETWORK {
  switch (network) {
    case 'main':
      return HD_DATA.main
    case 'test':
      return HD_DATA.test
    case 'regtest':
      return HD_DATA.regtest
  }
  throw new Error('invalid network')
}
