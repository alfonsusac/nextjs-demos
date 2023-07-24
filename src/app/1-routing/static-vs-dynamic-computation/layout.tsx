import { Browser } from "@/components/browser"
import Content from "./content.mdx"
import { ReactNode } from "@mdx-js/react/lib"
import Link from "next/link"
import { InlineLink } from "@/components/link"

const currentPath = '/1-routing/static-vs-dynamic-computation/'

const layoutGeneratedAt = new Date()


export default async function Layout(p: { children: ReactNode }) {


  return <>


    <Browser>

      <div>
        <InlineLink href={ currentPath + "books" }>Books - Dynamic Routes</InlineLink>
      </div>
      <div>
        <InlineLink href={ currentPath + "cars" }>Cars - Dynamic Routes using Route Segment Config</InlineLink>
      </div>
      <div>
        <InlineLink href={ currentPath + "dogs" }>Dogs - Dynamic Routes using Generated Params</InlineLink>
      </div>

      { p.children }

    </Browser>

    <Content />

  </>
}

export { layoutGeneratedAt }