'use client'

import { useEffect, useState } from "react"
import { useTOC } from "./context"
import { TOCItemType } from "./rsc"
import clsx from "clsx"
import { cn } from "../typography"


export function ToCSidebar(p: {
  items?: TOCItemType[],
  startDepth?: 1 | 2 | 3 | 4 | 5 | 6
  depth?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  listClassName?: string
}) {
  const startDepth = p.startDepth ?? 1


  const { toc } = useTOC()

  console.log("Client.tsx")
  console.log(toc)

  let items = getFilteredItems((toc), p.startDepth, p.depth)
  items = normalizeLevels(items) 

  const activeAnchor = useActiveHeadings(items.map(i => i.id))


  return (
    <ul className={cn("text-gray-500 mt-1 pb-2 pt-1 m-2", p.className)}>
      { items.map(i => <li
        className={ cn(
          "leading-tight py-1 transition-all",
          "ml-1 pl-3",
          "border-l-2",
          activeAnchor === i.id ? 'text-zinc-400 border-l-zinc-600' : 'border-l-zinc-900',
          i.level - startDepth === 0 ? 'ml-[0.25rem]' :
            i.level - startDepth === 1 ? 'ml-[1.25rem]' :
              i.level - startDepth === 2 ? 'ml-[2.25rem]' :
                i.level - startDepth === 3 ? 'ml-[3.25rem]' :
                  i.level - startDepth === 4 ? 'ml-[4.25rem]' : '',
          p.listClassName
        ) }
        key={ i.text }>
        <a href={ `#${i.id ?? ''}` }>
          { i.jsx ?? i.text }
        </a>
      </li>) }
    </ul>
  )
}

function getFilteredItems(items: TOCItemType[], start = 1, depth = 1) {
  return items
    .filter(i => i.level >= start && i.level < (start + depth))
}

function normalizeLevels(items: TOCItemType[]) {
  let cur = 6
  return items.map(i => {
    if (cur > i.level) {
      cur = i.level
    }
    return { ...i, level: (i.level - cur) + 1 }
  })
}



function useActiveHeadings(headingIds: string[]) {
  const [activeAnchor, setActiveAnchor] = useState<string>(headingIds[0])
  // console.log(headingIds)

  useEffect(() => {

    setActiveAnchor(prev => prev ? prev : headingIds[0])

    const observer = new IntersectionObserver(
      entries => {

        entries.map(e => {

          // Ignore initial intersection detection
          if (e.boundingClientRect.top > (window.innerHeight / 2)) return
          // Ignore intersection from the top edge
          if (e.boundingClientRect.top < 0) return

          // console.info(e.boundingClientRect)
          // console.info(e.rootBounds)

          // It can be deduced from observation that
          //  isIntersecting: true = going down
          //  isIntersecting: false = going up
          if (e.rootBounds) {

            // Going Down
            if (e.isIntersecting === true) {
              setActiveAnchor(prev => e.target.id)
            }

            // Going Up
            if (e.isIntersecting === false) {
              // Retrieve the header id from the previous index
              setActiveAnchor(prev =>
                headingIds.at(
                  Math.max(headingIds.findIndex(id => id === e.target.id) - 1, 0)
                ) ?? headingIds[0]
              )
            }
          }
        })
      },
      {
        // Occupy intersection zones with 10% height of the screen from the top.
        rootMargin: "0% 0% -80% 0%",
      }
    )

    // Register Observer for every item
    for (const headingid of headingIds) {
      const element = document.getElementById(headingid)
      if (element != null) {
        observer.observe(element)
      }
    }
    return () => {
      observer.disconnect()
    }
  }, [headingIds])

  useEffect(() => {
    // console.log("Active Anchor")
    // console.log(activeAnchor)
  }, [activeAnchor])

  return activeAnchor
}