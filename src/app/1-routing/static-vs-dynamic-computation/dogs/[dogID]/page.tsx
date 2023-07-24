import { layoutGenerationTime } from "../layout"

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


  return <div className="p-4 border border-zinc-800 rounded-lg">
    <h1 className="text-xl pt-2 pb-1">🐶 { p.params.dogID }</h1>

    <div className="mb-2">
      <span className="text-sm text-zinc-300 bg-zinc-900 p-1 px-2 rounded-md">Generated <b>{ seconds } seconds late</b> from parent layout.</span>
    </div>

    <p>This page is generated statically. If it doesn&apos;t exist/haven&apos;t been generated it will be generated upon request, showing the Loading UI.</p>
    <p>The next time you visit this page, it won&apos;t be generated again and will use the build cache instead.</p>
  </div>
}
