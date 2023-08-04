import clsx from 'clsx'
import type { MDXComponents } from 'mdx/types'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

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

const H2 = (p: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => {
  const anchor = getAnchor(p.children as string)
  return (
    <a
      href={ anchor.link }
      className="block group cursor-pointer no-underline"
    >
      <h2
        { ...p }
        id={ anchor.id }
        className={
          clsx(p.className, "group-hover:cursor-pointer")
        }
      >
        <span className="inline-block text-zinc-600 w-8 group-hover:text-yellow-400">
          <div className="transition-all group-hover:rotate-[30deg] w-min">
            §
          </div>
        </span>
        <span className="group-hover:border-b-zinc-500 transition-all border-b-2 border-b-zinc-500/0">
          { p.children }
        </span>
      </h2>
    </a>
  )
}