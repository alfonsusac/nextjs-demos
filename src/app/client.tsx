'use client'

import Link from "next/link"
import { titleCase } from "title-case"
import { usePathname, useSelectedLayoutSegments } from 'next/navigation'

function useSelected(path: string) {
  const pathname = usePathname()
  const layoutSegments = useSelectedLayoutSegments()
  const urlSegments = path.split('/')

  const firstTwoPath = ('/' + pathname.split('/').slice(1, 3).join('/'))

  return pathname === path || firstTwoPath === path
}

export function Page(p:{
  path: string,
  label?: string
}) {
  const selected = useSelected(p.path)
  const label = p.label ?? p.path.split('/').at(-1)!

  return (
    <li className={ "text-sm font-normal mt-2 leading-5 " + (selected ? "text-blue-500" : "text-zinc-400")}>
      <Link href={ p.path }>
        { titleCase(label.replaceAll('-', ' ')) }
      </Link>
    </li>
  )
}

export function Category(p: {
  label: string,
}) {
  const selected = useSelected(`/${p.label}`)

  return (
    <li className={ "text-xs font-semibold pt-6" + (selected ? " text-blue-500" : "") }>
      { titleCase(p.label.split('-')[1]) }
    </li>
  )
}

export function Article(p: {
  children: React.ReactNode
}) {
  let title = usePathname().split('/').at(2)?.replace(/[0-9]-/, '')
  if(!title) title = "Welcome to Alfon's Next.js Notes"
  
  
  return (
    <article className="p-4 w-full min-w-0">

      

      <header className="pt-4 pb-4">
        <h1>{ titleCase(title.replaceAll('-', ' ')) }</h1>
      </header>

      { p.children }

      <footer className="mt-12 py-12 border-t border-t-zinc-600 text-zinc-400">
        <p>
          The content on this website are purely written by Alfon to help people better understand how Next.js works and are not affiliated with Vercel (unofficial).
        </p>
        <p>
          If you have any comments for improvement on the website or the content feel free to visit <a href="https://github.com/alfonsusac/nextjs-demos/issues">the respository</a> which is 100% open source.
        </p>
        <p>
          Written by <a href="https://github.com/alfonsusac">@alfonsusac</a>
        </p>
      </footer>

    </article>
  )
}