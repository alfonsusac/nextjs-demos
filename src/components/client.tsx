'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { invalidateApplePage, invalidateEverything, invalidateSubpage } from "./action"

export default function Timer() {

  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(old => old + 1)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])


  return (
    <span className="text-blue-500 w-12 text-xs inline-block bg-zinc-950 p-2 font-mono text-right mr-2 rounded-md">
      { seconds }
    </span>
  )

}

export function A(p: {
  children: React.ReactNode
}) {
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  return (
    <a onClick={ () => {
      // if (!globalThis.window) return
      // startTransition(() => {
      //   globalThis.window.location.href = p.href
      // })
      startTransition(() => {
        router.refresh()
      })

    } }>
      { p.children } { isPending ? " ..." : "" }
    </a>
  )
}

export function B(p: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)

  return (
    <a onClick={ async () => {
      setCount(await invalidateEverything())
    } }>
      { p.children } | { count }
    </a>
  )
}
export function C(p: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)
  const [isPending, startTransition] = useTransition()

  return (
    <a onClick={ () => {
      startTransition(async () => setCount(await invalidateEverything()))
    } }>
      { p.children } | { count }
    </a>
  )
}
export function D(p: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)

  return (
    <a onClick={ async() => {
      setCount(await invalidateSubpage())
    } }>
      { p.children } | { count }
    </a>
  )
}
export function E(p: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)

  return (
    <a onClick={ async() => {
      setCount(await invalidateApplePage())
    } }>
      { p.children } | { count }
    </a>
  )
}