'use client'
import { InlineLink } from "@/components/link"
import { nanoid } from "nanoid"

export function GenerateRandomLink({ href, length, ...params}: Parameters<typeof InlineLink>[0] & { length?: number } ) {
  return (
    <InlineLink { ...params } href={ href + nanoid( length && length < 3 && length > 0 ? length : 1 ).toLowerCase() } />
  )
}
