import Link from "next/link"

import { ClientSideParams } from "./client"
import { layoutGenerationTime } from "@/app/layout"
import { GenerationTime } from "@/components/badges"

export default async function Page(p: { params: any }) {
  var endDate = new Date()
  var seconds = Math.round((endDate.getTime() - layoutGenerationTime.getTime()) / 1000)
  const data = await new Promise(resolve => setTimeout(resolve, 1000));
  return <article>
    <h2>🚘 <ClientSideParams /></h2>
    <GenerationTime seconds={ seconds } />
    <p>This is page is generated statically. It will throw error if you used the params props.</p>
    <p>If you still need to access the params, you need a client component to do that.</p>
  </article>
}
export const dynamic = 'force-static'