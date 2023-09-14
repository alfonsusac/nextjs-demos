import { unstable_cache } from "next/cache"
import { Return } from "@prisma/client/runtime/library"
import chalk from 'chalk'
import { Audit } from "@/components/timer"
import { cache, cache as reactCache } from "react"

type Callback<Parameters extends unknown[], ReturnType> = (...args: Parameters) => ReturnType
//                                 👇 has to be passed here
type MemoizePropType<Parameters extends unknown[]> = {
  persist?: boolean,
  duration?: number,
  log?: ('dedupe' | 'datacache')[],
  revalidateTags?: ((...params: Parameters) => string[]) | string[],
  additionalCacheKey?: ((...params: Parameters) => string[]) | string[]
}

/**   ###  MEMOIZE: unstable_cache() + cache()
         A way to generalize the data caching function in Next.js     
**/

export function memoizeTesting<R extends unknown[], T>(
  cb: Callback<R, T>,
  opts?: MemoizePropType<R>
) {
  const { // default values
    persist = true,
    duration = Infinity,
    log = ['datacache', 'dedupe'],
    revalidateTags: revalidateTagsFn,
    additionalCacheKey: additionalCacheKeyFn,
  } = opts ?? {}
  const logDataCache = log.includes('datacache')
  const logDedupe = log.includes('dedupe')


  let oldData: any
  let renderCacheHit: boolean
  renderCacheHit = false

  const cachedFn = cache(
    async (...args: R) => {
      renderCacheHit = true
      if (persist) {
        // Initialize unstable_cache
        const additionalCacheKey =
          additionalCacheKeyFn ?
            typeof additionalCacheKeyFn === 'function' ?
              additionalCacheKeyFn(...args) : additionalCacheKeyFn
            : [];
        const revalidateTags =
          revalidateTagsFn ?
            typeof revalidateTagsFn === 'function' ?
              revalidateTagsFn(...args) : revalidateTagsFn
            : [];
        const cacheKey = [cb.toString(), JSON.stringify(args), ...additionalCacheKey]
        const nextOpts = {
          revalidate: duration,
          tags: ['all', ...revalidateTags]
        }
        if (logDataCache) {
          let dataCacheMiss = false
          const audit = new Audit('', false)
          const data = await unstable_cache(
            async () => {
              dataCacheMiss = true
              return cb(...args)
            },
            cacheKey, nextOpts
          )()
          const time = audit!.getSec()
          const isSame = oldData === data
          console.log(
            `${chalk.hex('#AA7ADB').bold("Data Cache")} - ` +
            `${cb.name} ${chalk.hex('#AA7ADB').bold(dataCacheMiss ? "MISS" : "HIT")} ` +
            `${chalk.hex('A0AFBF')(time.toPrecision(3) + 's')} ` +
            `${chalk.hex('#AA7ADB').bold(dataCacheMiss ? isSame ? 'background-revalidation' : 'on-demand revalidation' : "")} ` +
            ''
          )
          oldData = data
          return data

        } else {
          const data = await unstable_cache(
            async () => {
              return cb(...args)
            }, [cb.toString(), JSON.stringify(args), ...additionalCacheKey], {
            revalidate: duration,
            tags: ['all', ...revalidateTags]
          }
          )()
          return data
        }
      } else {
        // return callback directly
        return cb(...args)
      }

    }
  )
  return async (...args: R) => {

    if (logDedupe) {
      let audit2 = new Audit('', false)
      let data = await cachedFn(...args)
      let time = audit2.getSec()
      console.log(
        `${chalk.hex('#FFB713').bold("Memoization")} - ` +
        `${cb.name} ${chalk.hex('#FFC94E').bold(renderCacheHit ? "MISS" : "HIT")} ` +
        `${chalk.hex('A0AFBF')(time.toPrecision(3) + 's')} ` +
        ''
      )
      renderCacheHit = false
      return data
    } else {
      return await cachedFn(...args)
    }
  }
}



// const LOG = false
// function print(obj: any) {
//   if (LOG) console.log(obj)
// }

// function logDataCache(string: string, hit: boolean, time: number,) {
//   console.log(
//     `${chalk.hex('#AA7ADB').bold("Data Cache")}` +
//     ' - ' +
//     `${string}` +
//     ' ' +
//     `${chalk.hex('#AA7ADB').bold(hit ? "HIT" : "MISS")}` +
//     ' ' +
//     `${chalk.hex('A0AFBF')(time.toPrecision(3) + 's')}` +
//     ' '
//   )
// }

// function logDedupe(string: string, hit: boolean, time: number,) {
//   console.log(
//     `${chalk.hex('#FFB713').bold("Memoization")}` +
//     ' - ' +
//     `${string}` +
//     ' ' +
//     `${chalk.hex('#FFC94E').bold(hit ? "HIT" : "MISS")}` +
//     ' ' +
//     `${chalk.hex('A0AFBF')(time.toPrecision(3) + 's')}` +
//     ' '
//   )
// }


// type Callback<S = any> = (...args: any[]) => S



// /**   ###  DATA CACHE
//          A way to cache results in between requests
//          to a dynamically rendered requests.        
// **/

// // Testing
// (async () => {
//   const foo = persistResult(async () => Math.random())
//   const bar = persistResult(() => Math.random())

//   const baz = persistResult(async () => Math.random())
//   const zee = persistResult(() => Math.random())
//   const a = await baz()
//   const b = await zee()
// })

// export function persistResult<CachedFunction extends Callback<ReturnType>, ReturnType = Return<CachedFunction>>(
//   callback: CachedFunction,
//   options?: {
//     additionalCacheKeys?: string[],
//     revalidateTags?: string[],
//     duration?: number, // default Infinity
//   }
// ): CachedFunction {
//   const fn = async (...params: Parameters<CachedFunction>) => {
//     let cacheHit = true
//     const audit = new Audit('', false)
//     const data = await unstable_cache(async () => {
//       cacheHit = false
//       return await callback(...params)
//     },
//       [callback.toString(), ...(options?.additionalCacheKeys ?? [])],
//       {
//         tags: options?.revalidateTags,
//         revalidate: options?.duration,
//       }
//     )()
//     const timeElapsed = audit.getSec()
//     logDataCache(`${callback.name}`, cacheHit, timeElapsed)
//     return data
//   }
//   return fn as any
// }

// /**   ###  DEDUPLICATION
//          A way to combine multiple calls into one.
//          Effective on a single render pass.       
//          - Wrap callback with dedupe and reuse function
//          - Every cache() calls creates a new entry.

//          const memoizedFn = dedupe(fn)
//          await memoizedFn()
// **/

// // Testing
// (async () => {
//   const foo = reactCache(async () => Math.random())
//   const bar = reactCache(() => Math.random())

//   const baz = dedupe(async () => Math.random())
//   const zee = dedupe(() => Math.random())
//   const a = await baz()
//   const b = await zee()
// })
// export function dedupe<CachedFunction extends Callback<Return>, Return = ReturnType<CachedFunction>>(
//   callback: CachedFunction,
// ) {

//   let cacheMiss = true
//   const cachedFunction = reactCache(
//     async (...params: Parameters<CachedFunction>) => {
//       cacheMiss = false
//       return await callback(...params)
//     }
//   )
//   return async (...params: Parameters<CachedFunction>) => {
//     const cacheHit = cacheMiss
//     const audit = new Audit('', false)
//     const data = await cachedFunction(...params)
//     const timeElapsed = audit.getSec()
//     logDedupe(`${callback.name}`, !cacheHit, timeElapsed)
//     return data
//   }
// }








export const delay = (ms: number): Promise<void> =>
  new Promise((resolve): void => {
    setTimeout(resolve, ms)
  })











// // Testing
// // (async () => {
// //   const cacheDataFn = persistResult(
// //     async () => await prisma.article.findMany(),
// //     {

// //     }
// //   )
// //   const cacheData = await cacheDataFn()

// //   const id = "2"
// //   const data = persistResult(
// //     async () => await prisma.article.findFirst({
// //       where: { id },
// //     }),
// //     {

// //     }
// //   )()
// // })

