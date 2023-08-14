'use client'

import Link from "next/link"
import { titleCase } from "title-case"
import { usePathname } from 'next/navigation'
import { slug } from "github-slugger"

function useSelected(path: string) {
  const pathname = usePathname()
  const firstTwoPath = ('/' + pathname?.split('/').slice(1, 3).join('/'))
  return pathname === path || firstTwoPath === path
}

export function Page(p:{
  category?: string,
  label: string
  children?: React.ReactNode
  path?: string
}) {
  const path = p.path ?? (p.category !== undefined ? `/${slug(p.category!)}/${slug(p.label)}` : `/${slug(p.label)}`)
  const selected = useSelected(path)

  return (
    <li className={ "text-sm font-normal mt-2 leading-5 " + (selected ? "text-blue-500" : "text-zinc-400")}>
      <Link href={ path }>
        { p.label }
      </Link>
      {
        selected ? p.children : null
      }
    </li>
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

// export function Article(p: {
//   children: React.ReactNode
// }) {
//   let title = usePathname()?.split('/').at(2)?.replace(/[0-9]-/, '')
//   if (!title) title = ""
  
//   return (
//     <>
//       <article className="p-4 w-full min-w-0">

//         <header className="pt-4 pb-4">
//           <h1>{ titleCase(title.replaceAll('-', ' ')) }</h1>
//         </header>
        
//         { p.children }

//         <footer className="mt-12 py-12 border-t border-t-zinc-600 text-zinc-500 text-sm space-y-2 leading-normal">
//           <p>
//             The content on this website are purely written by Alfon to help people better understand how Next.js works and are not affiliated with Vercel (unofficial).
//           </p>
//           <p>
//             If you have any comments for improvement on the website or the content feel free to visit <a href="https://github.com/alfonsusac/nextjs-demos/issues">the respository</a> which is 100% open source.
//           </p>
//           <p>
//             Written by <a href="https://github.com/alfonsusac">@alfonsusac</a>
//           </p>
//         </footer>

//       </article>
//     </>
//   )
// }
