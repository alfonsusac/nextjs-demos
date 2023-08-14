'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { TOCItemType } from "./rsc"
import { usePathname } from "next/navigation"


const TOCContext = createContext<{
  toc: TOCItemType[],
  location: string,
}>({
  toc: [],
  location: '',
})
export const useTOC = () => useContext(TOCContext)

export let setHeadings = (toc: TOCItemType[], location: string) => { }

export function TOCProvider(p: { children: React.ReactNode }) {

  const [toc, setToc] = useState<{ toc: TOCItemType[], location: string }>({ toc: [], location: ''})
  const pathname = usePathname()

  setHeadings = (toc: TOCItemType[], location: string) => {
    setToc({ toc , location: pathname ?? '' })
  }

  useEffect(() => {
    if (pathname?.includes(toc.location) === false) {
      // console.info(`Pathname differs from toc location,\n toc-location: ${toc.location} \n pathname: ${pathname}`)
      setToc({ toc: [], location: ''})
    }
  }, [pathname, toc.location])

  return <TOCContext.Provider value={ { toc: toc.toc, location: toc.location } }>
    { p.children }
  </TOCContext.Provider>
}



export function UseAsTOCContentClient(p: {
  children: React.ReactNode
  headings: TOCItemType[]
}) {

  const pathname = usePathname()

  useEffect(() => {
    // console.info("UseAsTOCContentClient")
    setHeadings(p.headings, pathname ?? '')
  }, [p.headings, pathname])

  return p.children
}

