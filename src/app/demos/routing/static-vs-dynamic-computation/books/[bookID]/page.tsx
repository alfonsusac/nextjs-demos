import { layoutGenerationTime } from "@/app/layout"
import { GenerationTime } from "@/components/badges"

export default async function Page(p: { params: any }) {
  var endDate = new Date()
  var seconds = Math.round((endDate.getTime() - layoutGenerationTime.getTime()) / 1000)
  const data = await new Promise(resolve => setTimeout(resolve, 1000));
  return <article>
    <header>
      <h2>📔 { p.params.bookID.replaceAll('%20', ' ') }</h2>
      <GenerationTime seconds={ seconds } />
    </header>
    <p>This page is generated dynamically which is evident by the loading UI when revisiting the page.</p>
    <p>Do note that dynamic pages are still cached per user preventing user to overload bandwidth by spamming navigations.</p>
  </article>
}