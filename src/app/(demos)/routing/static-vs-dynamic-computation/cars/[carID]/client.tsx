'use client'

import { useParams } from 'next/navigation'

export function ClientSideParams() {
  const params = useParams()

  return (<>{ params?.carID }</>)
}