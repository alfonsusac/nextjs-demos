import clsx from 'clsx'
import type { MDXComponents } from 'mdx/types'
import { Component, DetailedHTMLProps, HTMLAttributes } from 'react'
import { ApreventDefault } from './components/link'

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

function getAnchor(text: string) {
  const res = text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/[ ]/g, '-')
  return { id: res, link: `#${res}` }
}

function H2(p: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  const anchor = getAnchor(p.children as string)
  return (
    <ApreventDefault
      href={ anchor.link }
      className="block group cursor-pointer no-underline"
    >
      <h2
        { ...p }
        id={ anchor.id }
        className={
          clsx(p.className, "group-hover:cursor-pointer flex gap-4")
        }
      >
        <div className="transition-all group-hover:rotate-[30deg] w-min h-min inline-block text-zinc-600 group-hover:text-yellow-400"> 
          §
        </div>
        <div>
          <span className="group-hover:border-b-zinc-500 transition-all border-b-2 border-b-zinc-500/0">
            { p.children }
          </span>
        </div>
      </h2>
    </ApreventDefault>
  )
}
