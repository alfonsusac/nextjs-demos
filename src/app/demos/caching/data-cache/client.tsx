'use client'

import { differenceInSeconds, formatDistance, formatDistanceStrict, formatDuration } from "date-fns"
import { useEffect, useState } from "react"

export function Data_BackgroundRevalidation_Client(p: {
  renderTime: number,
  fetchTime: number,
  duration?: number,
}) {

  const [time, setTime] = useState<number>(p.renderTime)
  const isRevalidate = time && p.duration ? differenceInSeconds(time, new Date(p.fetchTime)) >= p.duration : false

  useEffect(() => {
    if (!time) setTime(Date.now())
  }, [time])

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    time && (
      <p className="text-xs font-bold text-zinc-500">
        Time since render:
        <span className="text-zinc-400">
          { formatDistanceStrict(p.renderTime, time, { unit: 'second' }) }
        </span><br />
        Time since fetch:
        <span className="text-zinc-400">
          { formatDistanceStrict(p.fetchTime, time, { unit: 'second' }) }
        </span> { isRevalidate ? "Invalidated on Next Request" : "" }<br />
        Revalidate: { p.duration } seconds
      </p>
    )
  )
}