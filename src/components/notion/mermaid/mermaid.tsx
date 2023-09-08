'use client'
import mermaid from "mermaid"
import { useEffect, useState } from "react"

mermaid.initialize({
  theme: "dark",
  securityLevel: 'loose',
})

export default function Mermaid(p: {
  chart: string,
}) { 

  const [mount, setMount] = useState(false)

  useEffect(() => {
    setMount(true)
  }, [])
  
  useEffect(() => {
    if (mount) {
      mermaid.contentLoaded()
    }
  },[mount])

  return (
    mount ? 
    <div className="mermaid">
      { p.chart }
    </div> : null
  )

}
