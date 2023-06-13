'use client'

import Link from "next/link"
import { useState } from "react"

export default function GenerateLinks() {
  
  const [links] = useState([100, 200, 300, 400, 500])

  return (
    <div className="bg-green-900 flex gap-2">
      {
        links.map((id) => <Link key={ id } href={ `/${id}` } className="p-2 hover:brightness-75">Go to { id }</Link>)
      }
    </div>
  )

}