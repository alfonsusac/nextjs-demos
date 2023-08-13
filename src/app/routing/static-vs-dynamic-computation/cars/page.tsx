import CodeSnippet from "@/components/code-snippet/client"
import DynamicRouteTurnedStaticCode from "./code.mdx"
import DynamicRouteTurnedStaticClientCode from "./code_client.mdx"
import DynamicRouteTurnedStaticBuildLog from "./buildlog.mdx"

export default function Page() {
  return <>
    <CodeSnippet
      title="app/cars/[carID]/page.js"
      code={ <DynamicRouteTurnedStaticCode /> }
    />
    <CodeSnippet
      title="ClientSideParams - client.js"
      code={ <DynamicRouteTurnedStaticClientCode /> }
      defaultClosed
    />
    <CodeSnippet
      title="Build logs"
      code={ <DynamicRouteTurnedStaticBuildLog /> }
      defaultClosed
    />
  </>
}