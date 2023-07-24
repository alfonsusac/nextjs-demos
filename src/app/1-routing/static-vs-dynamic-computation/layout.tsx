import { Browser } from "@/components/browser"
import Content from "./content.mdx"
import { ReactNode } from "@mdx-js/react/lib"
import { InlineLink } from "@/components/link"

const currentPath = '/1-routing/static-vs-dynamic-computation/'

export default async function Layout(p: { children: ReactNode }) {


  return <>


    <Browser>
      
      

      <div>
        <InlineLink href={ currentPath + "books" } loose>Books - Dynamic Routes</InlineLink>
      </div>
      <div>
        <InlineLink href={ currentPath + "cars" } loose>Cars - Dynamic Routes using &apos;force-static&apos;</InlineLink>
      </div>
      <div>
        <InlineLink href={ currentPath + "dogs" } loose>Dogs - Dynamic Routes using Generated Params</InlineLink>
      </div>

      <div className="h-full px-2 pt-2 mt-4 border-t border-t-zinc-800 rounded-lg">
        { p.children }
      </div>

    </Browser>

    <Content components={ {
      
    }} />

  </>
}
