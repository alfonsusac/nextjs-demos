import { unstable_cache } from "next/cache"
import { Return } from "@prisma/client/runtime/library"
import prisma from "./prisma"
import chalk from 'chalk';
import { Audit } from "@/components/timer"

const LOG = false
function print(obj: any) {
  if (LOG) console.log(obj)
}

function logCache(string: string, hit: boolean, time: number,) {
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


type Callback<S = any> = (...args: any[]) => Promise<S>

/**   #  DATA CACHE
          A way to cache results in between requests
          to a dynamically rendered requests.         **/

export function persistResult<T extends Callback<S>, S = Awaited<Return<T>>>(
  callback: T,
  options?: {
    additionalCacheKeys?: string[],
    revalidateTags?: string[],
    duration?: number, // default Infinity
  }
) {
  const fn = async (...params: Parameters<T>) => {
    let cacheHit = true
    const audit = new Audit('')
    const data = await unstable_cache(async () => {
      cacheHit = false
      return await callback(...params)
    },
      options?.additionalCacheKeys,
      {
        tags: options?.revalidateTags,
        revalidate: options?.duration,
      }
    )()
    const timeElapsed = audit.getSec()
    logCache(`${callback.name}`, cacheHit, timeElapsed)
    return data
  }
  return fn
}

// Testing
(async () => {
  const cacheDataFn = persistResult(
    async () => await prisma.article.findMany(),
    {

    }
  )
  const cacheData = await cacheDataFn()

  const id = "2"
  const data = persistResult(
    async () => await prisma.article.findFirst({
      where: { id },
    }),
    {

    }
  )()
})



/**
 * DATA CACHE
 *    A way to cache results in between requests
 *    to a dynamically rendered requests.
 */