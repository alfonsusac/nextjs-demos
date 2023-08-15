'use client'

import { useEffect, useState } from "react"
import { useTOC } from "./context"
import { TOCItemType } from "./rsc"
import clsx from "clsx"


export function ToCSidebar(p: {
  items?: TOCItemType[],
  startDepth?: 1 | 2 | 3 | 4 | 5 | 6
  depth?: 1 | 2 | 3 | 4 | 5 | 6
}) {
  const { toc } = useTOC()
  const items = getFilteredItems((toc), p.startDepth, p.depth)

  const activeAnchor = useActiveHeadings(items.map(i => i.id))

  const startDepth = p.startDepth ?? 1

  return (
    <ul className="text-gray-500 mt-1 pb-2 pt-1 m-2">
      { items.map(i => <li
        className={ clsx(
          "leading-tight py-1 transition-all",
          "ml-1 pl-3",
          "border-l-2",
          activeAnchor === i.id ? 'text-zinc-400 border-l-zinc-600' : 'border-l-zinc-900',
          i.level - startDepth === 0 ? 'ml-[0.25rem]' :
            i.level - startDepth === 1 ? 'ml-[1.25rem]' :
              i.level - startDepth === 2 ? 'ml-[2.25rem]' :
                i.level - startDepth === 3 ? 'ml-[3.25rem]' :
                  i.level - startDepth === 4 ? 'ml-[4.25rem]' : ''
        ) }
        key={ i.text }>
        <a href={ `#${i.id ?? ''}` }>
          { i.jsx }
        </a>
      </li>) }
    </ul>
  )
}

function getFilteredItems(items: TOCItemType[], start = 1, depth = 1) {
  return items
    .filter(i => i.level >= start && i.level < (start + depth))
}



function useActiveHeadings(headingIds: string[]) {
  const [activeAnchor, setActiveAnchor] = useState<string>(headingIds[0])

  useEffect(() => {

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
              setActiveAnchor(prev => headingIds.at(Math.max(headingIds.findIndex(id => id === e.target.id) - 1, 0)) ?? headingIds[0])
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

  return activeAnchor
}