import { Browser } from "@/components/browser"
import { InlineLink } from "@/components/link"
import { TOCContent } from "@/components/toc/rsc"
import Content from "./content.mdx"

const currentPath = '/caching/data-cache/'


export default async function Layout(p: { children: React.ReactNode }) {

  return <>

    <Browser>

      <InlineLink href={ currentPath } block>No Data Cache</InlineLink>
      <InlineLink href={ currentPath + "ratelimit" } loose block>Fetch</InlineLink>

      <div className="h-full px-2 pt-2 mt-4 border-t border-t-slate-800 rounded-lg">
        { p.children }
      </div>

    </Browser>

    <TOCContent>
      <Content />
    </TOCContent>

  </>
}
