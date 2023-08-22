'use client'

import Link from "next/link"
import { titleCase } from "title-case"
import { usePathname } from 'next/navigation'
import { slug } from "github-slugger"
import { cn } from "@/components/typography"
import { TOCProvider } from "@/components/toc/context"

function useSelected(path: string, match?:number) {
  const pathname = usePathname()

  const firstThreePath = ('/' + pathname?.split('/').slice(1, 2 + (match ?? 1)).join('/'))
  return pathname === path || firstThreePath === path
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
  // console.log("Hello")
  // console.log(path)
  const selected = useSelected(path, p.match ?? 1)
  const As = p.as ?? 'li'

  return (
    <As className={ cn(
      "text-sm font-normal leading-5",
      "transition-all duration-150",
      "hover:brightness-150",
      selected ? "text-blue-500" : "text-zinc-400",
      p.className
    ) }>
      <Link href={ path } className="block">
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

export function Content(p: {
  children: React.ReactNode,
  className: string
}) {
  return (
    <TOCProvider>
      <main className={ p.className }>
        { p.children }
      </main>
    </TOCProvider>
  )
}