import { layoutGenerationTime } from "@/app/layout"
import { GenerationTime } from "@/components/badges"

export default async function Page(p: { params: any }) {
  var endDate = new Date()
  var seconds = Math.round((endDate.getTime() - layoutGenerationTime.getTime()) / 1000)
  const data = await new Promise(resolve => setTimeout(resolve, 1000));
  return <article>
    <h2>📔 { p.params.bookID.replace('%20', ' ') }</h2>
    <GenerationTime seconds={ seconds } />
    <p>This page is generated dynamically which is evident by the loading UI</p>
  </article>
}