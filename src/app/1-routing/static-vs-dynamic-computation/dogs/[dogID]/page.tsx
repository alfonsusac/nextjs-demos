import { layoutGenerationTime } from "@/app/layout"
import { GenerationTime } from "@/components/badges"

export async function generateStaticParams() {
  return [
    { dogID: 'Labrador' },
    { dogID: 'Pomeranian' },
  ]
}

export default async function Page(p: { params: any }) {
  var endDate = new Date()
  var seconds = Math.round((endDate.getTime() - layoutGenerationTime.getTime()) / 1000);
  const data = await new Promise(resolve => setTimeout(resolve ,1000));
  return <article>
    <h2>🐶 { p.params.dogID }</h2>
    <GenerationTime seconds={ seconds } />
    <p>This page is generated statically. If it doesn&apos;t exist/haven&apos;t been generated it will be generated upon request, showing the Loading UI.</p>
    <p>The next time you visit this page, it won&apos;t be generated again and will use the build cache instead.</p>
  </article>
}
