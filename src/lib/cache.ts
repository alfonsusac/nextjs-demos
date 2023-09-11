import { unstable_cache } from "next/cache"
import { Return } from "@prisma/client/runtime/library"
import chalk from 'chalk'
import { Audit } from "@/components/timer"
import { cache as reactCache } from "react"

const LOG = false
function print(obj: any) {
  if (LOG) console.log(obj)
}

function logDataCache(string: string, hit: boolean, time: number,) {
  console.log(
    `${chalk.hex('#AA7ADB').bold("Data Cache")}` +
    ' - ' +
    `${string}` +
    ' ' +
    `${chalk.hex('#AA7ADB').bold(hit ? "HIT" : "MISS")}` +
    ' ' +
    `${chalk.hex('A0AFBF')(time.toPrecision(3) + 's')}` +
    ' '
  )
}

function logDedupe(string: string, hit: boolean, time: number,) {
  console.log(
    `${chalk.hex('#FFB713').bold("Memoization")}` +
    ' - ' +
    `${string}` +
    ' ' +
    `${chalk.hex('#FFC94E').bold(hit ? "HIT" : "MISS")}` +
    ' ' +
    `${chalk.hex('A0AFBF')(time.toPrecision(3) + 's')}` +
    ' '
  )
}


type Callback<S = any> = (...args: any[]) => S

export function cache<CachedFunction extends Callback<ReturnType>, ReturnType = Return<CachedFunction>>(
  callback: CachedFunction,
  options?: {
    additionalCacheKeys?: string[],
    revalidateTags?: string[],
    duration?: number, // default Infinity
  }
) {
  const persistedFn = persistResult( callback )

  const fn = dedupe(
    async (...params: Parameters<CachedFunction>) => await persistResult(
      async () => await callback(...params))
  )
  return fn
}

/**   ###  DATA CACHE
         A way to cache results in between requests
         to a dynamically rendered requests.        
**/

// Testing
(async () => {
  const foo = persistResult(async () => Math.random())
  const bar = persistResult(() => Math.random())

  const baz = persistResult(async () => Math.random())
  const zee = persistResult(() => Math.random())
  const a = await baz()
  const b = await zee()
})
export function persistResult<CachedFunction extends Callback<ReturnType>, ReturnType = Return<CachedFunction>>(
  callback: CachedFunction,
  options?: {
    additionalCacheKeys?: string[],
    revalidateTags?: string[],
    duration?: number, // default Infinity
  }
): CachedFunction {
  const fn = async (...params: Parameters<CachedFunction>) => {
    let cacheHit = true
    const audit = new Audit('', false)
    const data = await unstable_cache(async () => {
      cacheHit = false
      return await callback(...params)
    },
      [callback.toString(), ...(options?.additionalCacheKeys ?? [])],
      {
        tags: options?.revalidateTags,
        revalidate: options?.duration,
      }
    )()
    const timeElapsed = audit.getSec()
    logDataCache(`${callback.name}`, cacheHit, timeElapsed)
    return data
  }
  return fn
}

/**   ###  DEDUPLICATION
         A way to combine multiple calls into one.
         Effective on a single render pass.       
         - Wrap callback with dedupe and reuse function
         - Every cache() calls creates a new entry.

         const memoizedFn = dedupe(fn)
         await memoizedFn()
**/

// Testing
(async () => {
  const foo = reactCache(async () => Math.random())
  const bar = reactCache(() => Math.random())

  const baz = dedupe(async () => Math.random())
  const zee = dedupe(() => Math.random())
  const a = await baz()
  const b = await zee()
})
export function dedupe<CachedFunction extends Callback<Return>, Return = ReturnType<CachedFunction>>(
  callback: CachedFunction,
) {

  let cacheMiss = true
  const cachedFunction = reactCache(
    async (...params: Parameters<CachedFunction>) => {
      cacheMiss = false
      return await callback(...params)
    }
  )
  return async (...params: Parameters<CachedFunction>) => {
    const cacheHit = cacheMiss
    const audit = new Audit('', false)
    const data = await cachedFunction(...params)
    const timeElapsed = audit.getSec()
    logDedupe(`${callback.name}`, !cacheHit, timeElapsed)
    return data
  }
}








export const delay = (ms: number): Promise<void> =>
  new Promise((resolve): void => {
    setTimeout(resolve, ms)
  })











// Testing
// (async () => {
//   const cacheDataFn = persistResult(
//     async () => await prisma.article.findMany(),
//     {

//     }
//   )
//   const cacheData = await cacheDataFn()

//   const id = "2"
//   const data = persistResult(
//     async () => await prisma.article.findFirst({
//       where: { id },
//     }),
//     {

//     }
//   )()
// })

