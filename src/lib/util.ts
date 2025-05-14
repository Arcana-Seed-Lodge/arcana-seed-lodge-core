export function assert_ok (
  condition : boolean,
  message?  : string
) : asserts condition {
  if (!condition) {
    throw new Error(message ?? 'assertion failed')
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