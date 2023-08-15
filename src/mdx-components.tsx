import clsx from 'clsx'
import type { MDXComponents } from 'mdx/types'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { A_preventDefault } from './components/link'
import { slug } from 'github-slugger'
import innerText from "react-innertext"
import { H1, H2, H3 } from './components/typography'

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    // h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
    h1: H1,
    h2: H2,
    h3: H3,
    ...components,
  }
}