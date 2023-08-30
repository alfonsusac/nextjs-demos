'use client'

import { useEffect, useState, useTransition } from "react"
import { getAndAddViewCountAction } from "./server"

export function NotionPageViews(p: { id: string }) {

  const [count, setCount] = useState<number>()
  // const [loading, startTransition] = useTransition()

  
  useEffect(() => {
    
    async function init() {
      const count = await getAndAddViewCountAction(p.id)
      console.log("DONE HELLO: " + count)
    }

    console.log("Use Effect NotionPageViews")
    console.log(p.id)
    init()

        // getAndAddViewCountAction(p.id)
        //   .then(
        //     (count) => {
        //       console.log("THEN DONE")
        //       console.log(count)
        //       setCount(count)
        //     }
        //   )
    // setCount(2)

  }, [])

  return (
    count === undefined
      ?
      <>Loading...</>
      :
      <>{ `${count} views` }</>
  )

}