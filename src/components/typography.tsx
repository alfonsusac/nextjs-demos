import innerText from "react-innertext"
import { twMerge } from "tailwind-merge"
import clsx from "clsx"
import { slug } from "github-slugger"
import { Children } from 'react'

function getAnchor(jsx: React.ReactNode, id?: string) {
  if (id) return id

  const text = innerText(jsx)
  const slugged = slug(text)
  return slugged
}

export function cn(...className: (string | undefined)[]) {
  return twMerge(clsx(...className))
}

function Anchor(p: {
  slug: string
  children: React.ReactNode
}) {
  const node = Children.only(p.children)

  if (typeof node === 'function') {
    const element = node as React.ReactElement
    const prop = element.props
  }

  return (
    <a
      href={ `#${p.slug}` }
      className={ cn(
        "group flex",
        "cursor-pointer no-underline",
        "relative",
        "inline-flex",
        "items-baseline"
      ) }
    >
      <div className={
        cn(
          "text-2xl", // idk how to automate
          "text-slate-600",
          "before:content-['#']",
          "transition-all",
          "group-hover:rotate-[30deg]",
          "group-hover:text-yellow-400",
          "w-min h-min inline-block",
          "leading-[1.2]",
          "mr-4"
        )
      }
      />
      { p.children }
    </a>
  )
}

export function Heading(
  {
    children, className, id, level, ...params
  }:
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    > & {
      level: "1" | "2" | "3" | "4" | "5" | "6"
    }
) {
  const anchor = getAnchor(children, id)
  const H = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Anchor slug={ anchor }>
      <H { ...params as any } className={ cn(className) } id={anchor}>
        { children }
      </H>
    </Anchor>
  )
}

export function H1(params: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) {
  return <Heading level="1" {...params} />
}
export function H2(params: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) {
  return <Heading level="2" {...params} />
}
export function H3(params: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) {
  return <Heading level="3" {...params} />
}
export function H4(params: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) {
  return <Heading level="4" {...params} />
}
export function H5(params: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) {
  return <Heading level="5" {...params} />
}
export function H6(params: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) {
  return <Heading level="6" {...params} />
}