import Link from "next/link"
import CodeSnippet from "@/components/code-snippet"
import DynamicRouteTurnedStaticCode from "./code.mdx"
import DynamicRouteTurnedStaticBuildLog from "./buildlog.mdx"

const currentPath = '/1-routing/static-vs-dynamic-computation/dogs/'

const layoutGenerationTime = new Date()

export default function Layout(p: { children: React.ReactNode }) {

  return <>
    <h1 className="text-xl py-2">
      Dogs
    </h1>
    <p>
      This page shows how dynamic routing can also be statically precomputed at build-time specifically using { "\"" }generateStaticParams(){ "\"" }.
    </p>

    <CodeSnippet
      filepath="app/dogs/[dogID]/page.js"
      code={ <DynamicRouteTurnedStaticCode /> }
    />
    <CodeSnippet
      filepath="Build logs"
      code={ <DynamicRouteTurnedStaticBuildLog /> }
    />

    <div className="mt-4">

      <span>[dogID]: </span>

      <Link className="px-2" href={ currentPath + "Labrador" }>
        Labrador
      </Link>
      <Link className="px-2" href={ currentPath + "Pomeranian" }>
        Pomeranian
      </Link>
      <Link className="px-2" href={ currentPath + "Retriever" }>
        Retriever (Prefetch)
      </Link>
      <Link className="px-2" href={ currentPath + "Pug" } prefetch={false}>
        Pug (No prefetch)
      </Link>

    </div>

    <div className="mt-4">
      { p.children }
    </div>
  </>
}

export { layoutGenerationTime }