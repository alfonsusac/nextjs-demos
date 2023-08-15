import clsx from 'clsx'
import type { MDXComponents } from 'mdx/types'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { A_preventDefault } from './components/link'
import { slug } from 'github-slugger'
import innerText from "react-innertext"

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    // h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
    h2: H2,
    ...components,
  }
}

function getAnchor(jsx: React.ReactNode) {
  const text = innerText(jsx)
  const slugged = slug(text)
  return {
    id: slugged, link: `#${slugged}`
  }
}

function H2(p: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  const anchor = getAnchor(p.children)
  
  return (
    <A_preventDefault
      href={ anchor.link }
      className="group cursor-pointer no-underline mt-14 flex gap-4"
    >
      <div className="text-2xl transition-all group-hover:rotate-[30deg] w-min h-min inline-block text-zinc-600 group-hover:text-yellow-400 before:content-['§']  pointer-events-none"> 
      </div>

      <h2
        { ...p }
        id={ anchor.id }
        className={
          clsx(p.className,
            "group-hover:cursor-pointer h-full block pt-44 -mt-44",
            "group-hover:border-b-zinc-500 transition-all border-b-2 border-b-zinc-500/0 pointer-events-none"
          )
        }
      >
          { p.children }
      </h2>
    </A_preventDefault>
  )
}