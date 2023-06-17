import { cache } from "react"

export const getRandomNumber = cache(() => Math.random())
let globalCount = 0

export const addGlobal =  () => {
  globalCount += 1
  return globalCount
}
