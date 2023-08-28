'use client'

import { getAndAddViewCount } from "@/components/notion/data/metadata"
import { useEffect, useState } from "react"

export function NotionPageViews(p: { id: string }) {

  const [count, setCount] = useState<number>()

  useEffect(() => {
    getAndAddViewCount(p.id).then((count) => {
      setCount(count)
    })
  }, [p.id])

  return (
    count === undefined
      ?
      <>Loading...</>
      :
      <>{ `${count} views` }</>
  )

}