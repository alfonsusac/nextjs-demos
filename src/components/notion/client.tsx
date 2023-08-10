'use client'
import clsx from "clsx"
import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from "react"

export function Toggle(p:
  React.DetailedHTMLProps<
    React.HTMLAttributes<
      HTMLDivElement
    >,
    HTMLDivElement
  > & {
    headerSlot: React.ReactNode
  }
) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root
      open={ open }
      onOpenChange={ setOpen }
    >
      <Collapsible.Trigger asChild>
        <div className="flex cursor-pointer hover:bg-zinc-900/70 py-1 rounded-sm">
          <div className="w-8 h-4">
            <AkarIconsTriangleRightFill className={
              clsx(
                "transition-all duration-300 ease-in-out mx-auto mt-1",
                open ? "rotate-90" : ''
              )
            } />
          </div>
          { p.headerSlot }
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content>
        { p.children }
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

export function AkarIconsTriangleRightFill(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="M8 6a1 1 0 0 1 1.6-.8l8 6a1 1 0 0 1 0 1.6l-8 6A1 1 0 0 1 8 18V6Z"></path></svg>
  )
}