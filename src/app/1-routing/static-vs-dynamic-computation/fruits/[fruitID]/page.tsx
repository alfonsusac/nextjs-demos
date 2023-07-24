import Link from "next/link"

import CodeSnippet from "@/components/code-snippet"

export default function Page(p: { params: any }) {
  return <div className="p-4 border border-zinc-800 rounded-lg">
    <h1 className="text-xl py-2">{ p.params.carID }</h1>
  </div>
}