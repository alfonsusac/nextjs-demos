import CodeSnippet from "@/components/code-snippet"
import DynamicRouteTurnedStaticCode from "./code.mdx"
import DynamicRouteTurnedStaticClientCode from "./code_client.mdx"
import DynamicRouteTurnedStaticBuildLog from "./buildlog.mdx"

export default function Page() {
  return <>
    <CodeSnippet
      filepath="app/cars/[carID]/page.js"
      code={ <DynamicRouteTurnedStaticCode /> }
    />
    <CodeSnippet
      filepath="ClientSideParams - client.js"
      code={ <DynamicRouteTurnedStaticClientCode /> }
      defaultClosed
    />
    <CodeSnippet
      filepath="Build logs"
      code={ <DynamicRouteTurnedStaticBuildLog /> }
      defaultClosed
    />
  </>
}