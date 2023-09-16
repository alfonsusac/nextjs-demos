'use client'

import { useEffect, useState } from "react"

export function NotionPageViews(p: {
  cachedNum: number
  onLoadView: () => Promise<void>
}) {
  const [mount, setMount] = useState(false)

  useEffect(() => {
    if (!mount) {
      console.log("Hello");
      setMount(true);
      p.onLoadView()
    }
  }, [mount, p])
  
  return `${p.cachedNum} views`

}