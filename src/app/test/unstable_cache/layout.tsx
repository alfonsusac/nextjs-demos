import { delay } from "@/lib/cache"
import { nanoid } from "nanoid"
import { unstable_cache } from "next/cache"
import { getFn } from "./data"

export default async function Layout(p:{children: React.ReactNode}) {
  console.log("\n\n--begin (layout)--")

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

  return <>
    {p.children}
  </>
}