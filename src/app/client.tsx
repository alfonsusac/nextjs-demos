'use client'

import Link from "next/link"
import { titleCase } from "title-case"
import { usePathname } from 'next/navigation'
import { slug } from "github-slugger"
import { cn } from "@/components/typography"

function useSelected(path: string, match?:number) {
  const pathname = usePathname()
  const firstTwoPath = ('/' + pathname?.split('/').slice(1, 1 + (match ?? 1)).join('/'))
  return pathname === path || firstTwoPath === path
}

export function Page(p:{
  category?: string,
  label: string
  children?: React.ReactNode
  path?: string
  match?: number
  as?: keyof JSX.IntrinsicElements,
  className?: string
}) {
  const path = p.path ?? (p.category !== undefined ? `/${slug(p.category!)}/${slug(p.label)}` : `/${slug(p.label)}`)
  const selected = useSelected(path, p.match ?? 1)
  const As = p.as ?? 'li'

  return (
    <As className={ cn(
      "text-sm font-normal mt-2 leading-5",
      selected ? "text-blue-500" : "text-zinc-400",
      p.className
    ) }>
      <Link href={ path }>
        { p.label }
      </Link>
      {
        selected ? p.children : null
      }
    </As>
  )
}



export function Category(p: {
  label: string,
}) {
  const selected = useSelected(`/${p.label}`)

  return (
    <li className={ "text-xs font-semibold" + (selected ? " text-blue-500" : "") }>
      { titleCase(p.label) }
    </li>
  )
}