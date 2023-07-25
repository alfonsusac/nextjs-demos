import { layoutGenerationTime } from "@/app/layout"
import { GenerationTime } from "@/components/badges"

export async function generateStaticParams() {
  return [
    { episodeID: '1' },
    { episodeID: '2' },
  ]
}

export default async function Page(p: { params: any }) {
  var endDate = new Date()
  var seconds = Math.round((endDate.getTime() - layoutGenerationTime.getTime()) / 1000);

  const title = await fetchTitle(p.params.episodeID)


  return <article>
    <h2>🍿 Episode { p.params.episodeID }: { title }</h2>
    <GenerationTime seconds={ seconds } />
    <p>This page is generated statically at build time. If it doesn&apos;t exist then it will show not-found page.</p>
  </article>
}

export const dynamicParams = false
  
  
async function fetchTitle(id: number): Promise<string> {
  const data = await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    'The Pilot',
    'The Big Bran Hypothesis'
  ][id-1]
}