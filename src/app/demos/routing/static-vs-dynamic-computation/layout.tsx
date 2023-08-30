import { Browser } from "@/components/browser"
import { InlineLink } from "@/components/link"
import Content from "./content.mdx"
import Text from "./text.mdx"
import { TOCContent } from "@/components/toc/rsc"
import { CommentSection } from "@/components/giscus"

const currentPath = '/demos/routing/static-vs-dynamic-computation/'

export default async function Layout(p: { children: React.ReactNode }) {


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

    <TOCContent>
      {/* <Text /> */}
      <Content />
    </TOCContent>

    <CommentSection />

  </>
}
