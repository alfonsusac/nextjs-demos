'use client'

import { formatDistanceToNow } from "date-fns"

export function GenerationTime(p: {
  seconds: number
}) {
  return (
    <div className="mb-2">
      <div>
        <span className="text-sm text-zinc-300 bg-zinc-900 p-1 px-2 rounded-md">Generated <b>{ p.seconds } seconds late</b> from parent layout.</span>
      </div>
    </div>
  )
}