import CodeSnippet from "@/components/code-snippet"
import DynamicRouteTurnedStaticCode from "./code.mdx"
import DynamicRouteTurnedStaticBuildLog from "./buildlog.mdx"

export default function Page() {
  return <>
    <CodeSnippet
      filepath="app/dogs/[dogID]/page.js"
      code={ <DynamicRouteTurnedStaticCode /> }
    />
    <CodeSnippet
      filepath="Build logs"
      code={ <DynamicRouteTurnedStaticBuildLog /> }
    />
  </>
}