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
    {/* <h2>🚘 {p.params.carID}</h2> */}
    <GenerationTime seconds={ seconds } />
    <p>This is page is generated statically when user visits the site. It will only be generated once. Subsequent visits will used the build cache.</p>
    <p>If you need to access the params, it will throw error if you used the params props. Instead, use useParams() in a client component to access the params.</p>
  </article>
}
export const dynamic = 'force-static'