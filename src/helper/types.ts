export type Callback<
  P extends any,
  R extends any
> = (...any: P[]) => R | Promise<R>