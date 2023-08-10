'use client'

import { useState } from "react"
import { getFileSpans } from "./code-snippet/utilt"

export default function CodeSnippet(p: {
  title: string,
  code: JSX.Element,
  defaultClosed?: boolean,
  children?: React.ReactNode
}) {
  const [opened, setOpened] = useState(!p.defaultClosed)

  if(p.title === undefined) return <></>
  console.info(JSON.stringify(p.title))
  console.info("Title: "+p.title)
  const textspans = getFileSpans(p.title)
  
  return (
    <div className="border border-zinc-800 rounded-lg my-4 relative w-full">
      <input 
        type="checkbox"
        className="peer group absolute block w-full h-10 opacity-0"
        checked={ opened }
        onChange={ () => setOpened(prev => !prev) }
        title={ p.title }
      />
      <label
        className="p-3 text-xs text-zinc-400 px-4 flex justify-between after:content-['expand'] peer-checked:after:content-['collapse']"
        htmlFor={p.title}
      >
        <div className="flex gap-1">
          <MdiCodeJson className="h-full mr-2"/>
          {
            textspans.map((t, i) =>
              t === '/' ?
                <span key={ i }>/</span> :
                <span key={ i }>{ t }</span>
            )
          }
        </div>
      </label>
      <div className="overflow-hidden h-0 peer-checked:h-full">
        { p.code }
        { p.children }
      </div>
    </div>
  )
}


export function MdiCodeJson(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="M5 3h2v2H5v5a2 2 0 0 1-2 2a2 2 0 0 1 2 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2m14 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2a2 2 0 0 1-2-2V5h-2V3h2m-7 12a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m-4 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1Z"></path></svg>
  )
}


function MdiConsoleLine(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="M13 19v-3h8v3h-8m-4.5-6L2.47 7h4.24l4.96 4.95c.58.59.58 1.55 0 2.12L6.74 19H2.5l6-6Z"></path></svg>
  )
}