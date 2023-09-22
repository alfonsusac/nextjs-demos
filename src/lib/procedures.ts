import type { Callback } from "@/helper/types"

export const Procedure = {
  prefetchForStatic<R extends any>(cb: Callback<any, R>, fallback: R) {
    try {
      return cb()
    } catch (error) {
      console.log(`Error prefetching ${cb.name && `for ${cb.name}`}:`)
      console.log(error)
      return fallback
    }
  },

  parallel<T extends unknown[]>(...args: Parameters< typeof Promise.all<T>>) {
    return Promise.all<T>(...args)
  }
}