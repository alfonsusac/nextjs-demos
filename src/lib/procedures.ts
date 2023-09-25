import type { Callback } from "@/helper/types"
import { delay } from "./memoize"

export const Procedure = {
  prepareForStatic<R extends any>(cb: Callback<any, R>, fallback: R) {
    try {
      return cb()
    } catch (error) {
      console.log(`Error prefetching ${cb.name && `for ${cb.name}`}:`)
      console.log(error)
      return fallback
    }
  },

  parallel<T extends unknown[]>(...args: Parameters<typeof Promise.all<T>>) {
    return Promise.all<T>(...args)
  },

  maxTime<R extends any>(prom: Promise<R>, ms: number) {
    return Promise.race([
      (
        async () => ({ res: await prom, timelimit: false as false })
      )(),
      (
        async () => {
          await delay(ms)
          return ({ res: null, timelimit: true as true })
        }
      )()
    ])
  }
}