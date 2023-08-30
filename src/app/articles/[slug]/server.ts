'use server'

// import { getAndAddViewCount } from "@/components/notion/data/metadata"

 

export async function getAndAddViewCountAction(slug: string) {
  console.log("Hello Server")
  return "THREE"
  // return getAndAddViewCount(slug)
}