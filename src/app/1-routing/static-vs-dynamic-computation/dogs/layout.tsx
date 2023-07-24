import { InlineLink } from "@/components/link"

const currentPath = '/1-routing/static-vs-dynamic-computation/dogs/'

const layoutGenerationTime = new Date()

export default function Layout(p: { children: React.ReactNode }) {

  return <div className="h-full px-2 pt-2 mt-4 border-t border-t-zinc-800 rounded-lg">
    <h1 className="text-xl py-2">
      Dogs
    </h1>

    <div className="my-2 mt-0 flex gap-x-3 gap-y-2  flex-wrap">

      <InlineLink href={ currentPath }>
        Home
      </InlineLink>
      <span className="text-zinc-600 m-0">|</span>
      <InlineLink href={ currentPath + "Labrador" }>
        Labrador
      </InlineLink>
      <InlineLink href={ currentPath + "Pomeranian" }>
        Pomeranian
      </InlineLink>
      <InlineLink href={ currentPath + "Retriever" }>
        Retriever (Prefetch)
      </InlineLink>
      <InlineLink href={ currentPath + "Pug" } prefetch={ false }>
        Pug (No prefetch)
      </InlineLink>

    </div>

    <div className="">
      { p.children }
    </div>






  </div>
}

export { layoutGenerationTime }