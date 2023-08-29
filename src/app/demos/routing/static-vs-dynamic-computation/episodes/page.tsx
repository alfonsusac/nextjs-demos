import CodeSnippet from "@/components/code-snippet/client"
import DynamicRouteTurnedStaticCode from "./code.mdx"
import DynamicRouteTurnedStaticBuildLog from "./buildlog.mdx"

export default function Page() {
  return <>
    <CodeSnippet
      title="app/dogs/[dogID]/page.js"
      code={ <DynamicRouteTurnedStaticCode /> }
    />
    <CodeSnippet
      title="Build logs"
      code={ <DynamicRouteTurnedStaticBuildLog /> }
    />
    <p>
      Do note that not-found only works in build. In development mode, everything is rendered at request time.
    </p>
  </>
}