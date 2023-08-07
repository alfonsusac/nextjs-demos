import { Browser } from "@/components/browser"
import { ReactNode } from "@mdx-js/react/lib"
import { InlineLink } from "@/components/link"

const currentPath = '/routing/static-vs-dynamic-computation/'

import Content from "./content.mdx"
import { TOCContent } from "@/components/toc/rsc"

export default async function Layout(p: { children: ReactNode }) {


  return <>

    <Browser>

      <InlineLink href={ currentPath } block>○ Static Route (Home)</InlineLink>
      <InlineLink href={ currentPath + "books" } loose block>λ Dynamic Routes (Books)</InlineLink>
      <InlineLink href={ currentPath + "cars" } loose block>○ Dynamic Routes using &apos;force-static&apos; (Cars)</InlineLink>
      <InlineLink href={ currentPath + "dogs" } loose block>● Dynamic Routes using Generated Params (Dogs)</InlineLink>
      <InlineLink href={ currentPath + "episodes" } loose block>● Dynamic Routes using Generated Params and dynamicParams = false (Episodes)</InlineLink>

      <div className="h-full px-2 pt-2 mt-4 border-t border-t-zinc-800 rounded-lg">
        { p.children }
      </div>

    </Browser>


    {/* <TestHeading className="Test" /> */}

    <TOCContent>
      <Content />
    </TOCContent>

  </>
}
