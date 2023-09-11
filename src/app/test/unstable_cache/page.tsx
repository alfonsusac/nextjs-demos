import { clearLog } from "@/components/timer"
import { delay } from "@/lib/cache"
import { nanoid } from "nanoid"
import { unstable_cache } from "next/cache"
import { cache } from "react"

export async function generateMetadata() {


  console.log("\n\n--begin (page metadata)--")
  // const test = await unstable_cache(async () => {
  //   await delay(318)
  //   const data = nanoid(4)
  //   console.log("miss - " + data)
  //   return data
  // }, [], { revalidate: 10 })()

  // const val1 = test
  // const val2 = test
  // const val3 = test
  // const val4 = test

  const val1 = await getFn()
  const val2 = await getFn()
  const val3 = await getFn()

  console.log(val1)
  console.log(val2)
  console.log(val3)


  console.log("--done--\n\n")
  return {
    title: val1
  }
}

export const getFn = memoize2(
  async () => {
    await delay(224)
    const data = nanoid(4)
    console.log("miss - " + data)
    return data
  }
)

function memoize(
  cb: any
) {
  const cachedFn = cache(
    async () => {
      console.log("miss dedupe")
      return await unstable_cache(
        async () => {
          return cb()
        }, [cb.toString()], { revalidate: 10 }
      )()
    }
  )
  return cachedFn
}


function memoize2(
  cb: any
) {
  let olddata: any
  const cachedFn = cache(
    async () => {
      console.log("miss dedupe")
      let dataCacheHit = false
      const data = await unstable_cache(
        async () => {
          dataCacheHit = true
          return cb()
        }, [cb.toString()], { revalidate: 20, tags:["Test"] }
      )()

      if (olddata !== data && dataCacheHit)
        console.log("Data Cache -> " + dataCacheHit + ' (initial / on-demand)')
      if (olddata === data && dataCacheHit)
        console.log("Data Cache -> " + dataCacheHit + ' (background revalidation)')
      if (!dataCacheHit)
        console.log("Data Cache -> " + dataCacheHit )
      
      olddata = data
      // console.log("Data Cache -> " + dataCacheHit)
      return data
    }
  )


  return cachedFn
}


export default async function Page() {

  console.log("\n\n--begin (page)--")

  const val1 = await getFn()
  const val2 = await getFn()
  const val3 = await getFn()

  console.log(val1)
  console.log(val2)
  console.log(val3)

  // const test = await unstable_cache(async () => {
  //   await delay(318)
  //   const data = nanoid(4)
  //   console.log("miss - " + data)
  //   return data
  // },[],{revalidate: 10})()

  // const val1 = test
  // const val2 = test
  // const val3 = test
  // const val4 = test


  // console.log(val4)

  console.log("--done--\n\n")

  return (
    <>
      { val1 }<br />
      { val2 }<br />
      { val3 }<br />
    </>
  )
}