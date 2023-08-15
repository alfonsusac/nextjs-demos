import innerText from "react-innertext"
import { twMerge } from "tailwind-merge"
import clsx from "clsx"
import { slug } from "github-slugger"

function getAnchor(jsx: React.ReactNode) {
  const text = innerText(jsx)
  const slugged = slug(text)
  return {
    id: slugged, link: `#${slugged}`
  }
}

export function cn(...className: (string | undefined)[]) {
  return twMerge(clsx(...className))
}

export function H1({
  children, className, ...params
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) {
  return (
    <h1 { ...params } className={ cn(
      className,
      // "text-4xl font-semibold text-white"
    ) }>
      { children }
    </h1>
  )
}

export function H2({
  children, className, ...params
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>
) {
  const anchor = getAnchor(children)
  return (
    <a
      href={ anchor.link }
      className={
        cn(
          "group flex",
          "cursor-pointer no-underline",
          "mt-14 mb-6 relative",
          "prose-h2:mt-0"
        )
      }
      aria-labelledby={ anchor.id }
    >
      {/* Anchor */ }
      <div className={
        cn(
          "text-2xl text-zinc-600",
          "before:content-['§']",
          "transition-all",
          "group-hover:rotate-[30deg]",
          "group-hover:text-yellow-400",
          "w-min h-min inline-block",
        )
      }>
      </div>
      {/* <span id={ anchor.id } className="absolute -mt-32">ee</span> */}
      <h2 id={ anchor.id } { ...params } className={
        cn(
          "ml-4",
          "group-hover:cursor-pointer",
          className,
        )
      }>
        { children }
      </h2>
    </a>
  )
}

export function H3({
  children, className, ...params
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) {
  return (
    <h3 { ...params } className={ cn(
      className,
      "text-4xl font-semibold text-white"
    ) }>
      { children }
    </h3>
  )
}