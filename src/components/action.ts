'use server'

import { revalidatePath } from "next/cache"

let count = 0

export async function invalidateEverything() {
  count += 1;
  revalidatePath('/')
  return count
}

export async function invalidateSubpage() {
  count += 1;
  revalidatePath('/[pageid]/test')
  return count
}
export async function invalidateApplePage() {
  count += 1;
  revalidatePath('/apple')
  return count
}
