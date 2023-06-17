'use client'
import { useSelectedLayoutSegments } from 'next/navigation'

export function BreadCrump1(){
  const segments = useSelectedLayoutSegments()

  return (
    <>
      {'File: src/app/' + segments.join('/')}
    </>
  )
}

export function BreadCrump2(p: {
  url: string
}) {
  const segments = useSelectedLayoutSegments()

  return (
    <>
      { 'URL: ' + p.url + segments.filter(s => !s.match('\\(')).join('/') }
    </>
  )
}

