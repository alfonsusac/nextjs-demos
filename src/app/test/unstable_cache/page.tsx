import { clearLog } from "@/components/timer"
import { delay, memoizeInside } from "@/lib/cache"
import { nanoid } from "nanoid"
import { unstable_cache } from "next/cache"
import { cache } from "react"

// Page for testing

async function getnanoid() {
  await delay(2207)
  const data = nanoid(4)
  console.log("midd - " + data)
  return data
}

export const getFn = memoizeInside(getnanoid)

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
  // console.log(val1)
  // console.log(val2)
  // console.log(val3)
  console.log("--done--\n\n")
  return {
    title: val1
  }
}



// function memoize(
//   cb: any
// ) {
//   const cachedFn = cache(
//     async () => {
//       console.log("miss dedupe")
//       return await unstable_cache(
//         async () => {
//           return cb()
//         }, [cb.toString()], { revalidate: 10 }
//       )()
//     }
//   )
//   return cachedFn
// }





export default async function Page() {
  console.log("\n\n--begin (page)--")
  const val1 = await getFn()
  const val2 = await getFn()
  const val3 = await getFn()

  // console.log(val1)
  // console.log(val2)
  // console.log(val3)

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

// Old function for reference

function memoize2(
  cb: any
) {
  let olddata: any
  let renderCacheHit = false
  const cachedFn = cache(
    async () => {
      renderCacheHit = true
      console.log("miss dedupe")
      let dataCacheMiss = false
      const data = await unstable_cache(
        async () => {
          dataCacheMiss = true
          return cb()
        }, [cb.toString()], { revalidate: 20, tags: ["Test"] }
      )()
      if (olddata !== data && dataCacheMiss)
        console.log("Data Cache -> " + dataCacheMiss + ' (initial / on-demand)')
      if (olddata === data && dataCacheMiss)
        console.log("Data Cache -> " + dataCacheMiss + ' (background revalidation)')
      if (!dataCacheMiss)
        console.log("Data Cache -> " + dataCacheMiss)

      console.log(Math.random())
      olddata = data
      return data
    }
  )
  return async () => {
    const data = await cachedFn()
    console.log("Dedupe1 -> " + renderCacheHit)
    renderCacheHit = false
    return data
  }
}