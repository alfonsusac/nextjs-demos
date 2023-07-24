'use client'
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import path from "path"



export function InlineLink(p: {
  children: React.ReactNode
  href: string
  prefetch?: false
  loose?: true
  useAnchor?: true
}) {
  const pathname = usePathname()
  const selected = !p.loose ?
    pathname === removeTrailingSlash(p.href) :
    pathname.match(p.href)

  console.log(pathname)
  console.log(p.href)

  return !p.useAnchor ? (
    <Link
      href={ p.href }
      className={ clsx(
        "inline flex-shrink-0",
        selected ?
          "text-blue-500 hover:text-blue-400" :
          "text-zinc-400 hover:text-zinc-300"
      ) }
      prefetch={ p.prefetch }
    >
      { p.children }
    </Link>
  ) : (
    <a
      href={ p.href }
      className={ clsx(
        "inline flex-shrink-0",
        selected ?
          "text-blue-500 hover:text-blue-400" :
          "text-zinc-400 hover:text-zinc-300"
      ) }
    >
      { p.children }
    </a>
  )
}

function removeTrailingSlash(str: string) {
  if (str.at(-1) === '/' || str.at(-1) === '\\') {
    return str.slice(0, -1)
  } else {
    return str
  }
}