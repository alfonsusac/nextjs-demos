'use client'

import { useEffect, useState } from "react"

export function NotionPageViews(p: {
  id: string,
  num: number
  loadView: (id:string) => Promise<void>
}) {

  const [mount, setMount] = useState(false)

  useEffect(() => {
    // Carefull, this will be run every render!
    if (!mount) {
      (async () => {
        const count = await p.loadView(p.id)
        setMount(true)
      })()
    }

  })

  return `${p.num} views`

}