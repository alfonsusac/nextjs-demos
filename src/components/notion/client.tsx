'use client'

import clsx from "clsx"
import * as Collapsible from '@radix-ui/react-collapsible'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useState } from "react"
import { cn } from "../typography"
import Image from "next/image"
import { ErrorBoundary } from "react-error-boundary"


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
  const [open, setOpen] = useState(false)

  return (
    <Collapsible.Root open={ open } onOpenChange={ setOpen }>
      <Collapsible.Trigger asChild>

        <div className={ cn(
          "toggle flex cursor-pointer hover:bg-zinc-900/70 py-1 rounded-sm",
          p.className
        ) }>
          <div className={ cn("h-[1lh] w-8 text-center flex-shrink-0") }>

            <AkarIconsTriangleRightFill className={
              clsx(
                "transition-all duration-300 ease-in-out inline",
                open ? "rotate-90" : ''
              )
            } />
          </div>
          { p.headerSlot }
        </div>

      </Collapsible.Trigger>

      <Collapsible.Content> { p.children } </Collapsible.Content>
    </Collapsible.Root>
  )
}

function AkarIconsTriangleRightFill(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="M8 6a1 1 0 0 1 1.6-.8l8 6a1 1 0 0 1 0 1.6l-8 6A1 1 0 0 1 8 18V6Z"></path></svg>
  )
}





export function InlineMentionTooltip(p: {
  children: React.ReactNode,
  content: React.ReactNode,
}) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          { p.children }
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            forceMount={ true }
            side="bottom"
            className={ clsx(
              "data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade",
              "data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade",
              "data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade",
              "data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade",
              "text-violet11 select-none rounded-[4px]",
              // "leading-none",
              "shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]",
              "will-change-[transform,opacity]",
              "bg-zinc-800 p-1 pb-0.5 pr-1.5 text-xs text-zinc-400",
              "border-zinc-700 border",
              "inline-block align-middle"
            ) }
            sideOffset={ 3 }
          >
            { p.content }
            {/* Add to library */ }
            {/* <Tooltip.Arrow className="fill-zinc-800" /> */ }
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

type ImageProps = React.ComponentProps<typeof Image>