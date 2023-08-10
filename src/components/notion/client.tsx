'use client'

import clsx from "clsx"

export function Toggle(p:
  React.DetailedHTMLProps<
    React.HTMLAttributes<
      HTMLDivElement
    >,
    HTMLDivElement
  >
) {
  return (
    <div className={
      clsx(
        p.className,
        '',
      )
    }>
      { p.children }
    </div>
  )
}