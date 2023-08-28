'use client'

import { getAndAddViewCount } from "@/components/analytics/server"
import { useEffect, useState } from "react"

export function NotionPageViews(p: { id: string }) {

  const [count, setCount] = useState<number>()

  useEffect(() => {
    getAndAddViewCount({
      pageID: p.id
    }).then((count) => {
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