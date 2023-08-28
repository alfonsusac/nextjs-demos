'use client'

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { AddViewCount } from "./cb"

export function ReadAnalytics() {
  
  const { ref } = useInView({
    threshold: 0,
    triggerOnce: true,
    initialInView: false,
    onChange(inView) {
      // Finished Reading
    }
  })

  return (
    <div className="h-8" ref={ref}>

    </div>
  )
}


export function ViewAnalytics(p: {id: string}) {
  
  useEffect(() => {
    AddViewCount(p.id)
  },[p.id])

  return (
    <>
    </>
  )
}