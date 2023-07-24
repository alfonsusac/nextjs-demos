'use client'
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
export function InlineLink(p: {
  children: React.ReactNode
  href: string
  prefetch?: false
}) {
  const pathname = usePathname()
  const selected = pathname.match(p.href)

  return (
    <Link
      href={ p.href }  
      className={ clsx(
        "mx-2",
        selected ?
          "text-blue-500 hover:text-blue-400" :
          "text-zinc-400 hover:text-zinc-300"
      ) }
      prefetch={p.prefetch}
    >
      {p.children}
    </Link>
  )
}