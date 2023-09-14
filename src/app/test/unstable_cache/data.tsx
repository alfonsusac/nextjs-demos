import { delay, memoizeTesting } from "@/lib/cache"
import { nanoid } from "nanoid"

async function getnanoid() {
  await delay(2207)
  const data = nanoid(4)
  console.log("midd - " + data)
  return data
}
export const getFn = memoizeTesting(getnanoid)
