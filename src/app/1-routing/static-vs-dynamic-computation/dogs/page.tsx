import CodeSnippet from "@/components/code-snippet"
import DynamicRouteTurnedStaticCode from "./code.mdx"
import DynamicRouteTurnedStaticBuildLog from "./buildlog.mdx"

export default function Page() {
  return <div>
    <p>
      This page shows how dynamic routing can also be statically precomputed at build-time specifically using <code>generateStaticParams()</code>
    </p>
    <CodeSnippet
      filepath="app/dogs/[dogID]/page.js"
      code={ <DynamicRouteTurnedStaticCode /> }
    />
    <CodeSnippet
      filepath="Build logs"
      code={ <DynamicRouteTurnedStaticBuildLog /> }
    />

  </div>
}