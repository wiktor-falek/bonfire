export type ResultOk<T> = {
  val: T;
  ok: true;
  unwrap: () => T;
  unwrapOr: <TDefault>(defaultValue: TDefault) => T;
  unwrapOrElse: <TReturn>(cb: (err: string) => TReturn) => T;
};

export type ResultErr = {
  err: string;
  ok: false;
  unwrap: () => never;
  unwrapOr: <TDefault>(defaultValue: TDefault) => TDefault;
  unwrapOrElse: <TReturn>(cb: (err: string) => TReturn) => TReturn;
};

export type Result<T> = ResultOk<T> | ResultErr;

export function Ok<T>(value: T): ResultOk<T> {
  return {
    val: value,
    ok: true,
    unwrap: () => value,
    unwrapOr: (defaultValue) => value,
    unwrapOrElse: () => value,
  };
}

export function Err(message: string): ResultErr {
  return {
    err: message,
    ok: false,
    unwrap: () => {
      throw new Error(message);
    },
    unwrapOr: (defaultValue) => defaultValue,
    unwrapOrElse: (cb) => cb(message),
  };
}
