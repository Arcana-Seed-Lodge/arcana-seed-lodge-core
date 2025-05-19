export function assert_ok (
  condition : boolean,
  message?  : string
) : asserts condition {
  if (!condition) {
    throw new Error(message ?? 'assertion failed')
  }
}

export function assert_size (
  input    : Uint8Array,
  size     : number,
  err_msg ?: string
) {
  if (input.length !== size) {
    throw new Error(err_msg ?? `input size mismatch: ${input.length} !== ${size}`)
  }
}

export function assert_exists <T> (
  input   ?: T | null | undefined,
  err_msg ?: string
) : asserts input is NonNullable<T> {
  if (typeof input === 'undefined') {
    throw new TypeError(err_msg ?? 'Input is undefined!')
  }
  if (input === null) {
    throw new TypeError(err_msg ?? 'Input is null!')
  }
}

export function is_hex_str (str : string) : boolean {
  return /^[0-9A-Fa-f]+$/.test(str)
}

export function is_base64_str (str : string) : boolean {
  return /^[A-Za-z0-9+/]+={0,2}$/.test(str)
}

export function is_bech32_str (str : string) : boolean {
  return /^[A-Za-z0-9]+$/.test(str)
}
