import { Browser } from "@/components/browser"
import Content from "./content.mdx"
import { ReactNode } from "@mdx-js/react/lib"
import Link from "next/link"

const currentPath = '/1-routing/static-vs-dynamic-computation/'

const layoutGeneratedAt = new Date()


export default async function Layout(p: { children: ReactNode }) {


  return <>


    <Browser>

      <div>
        Page generated at { layoutGeneratedAt.getMinutes() }:{ layoutGeneratedAt.getSeconds() }
      </div>
      <div>
        <Link href={ currentPath + "books" }>Books - Dynamic Routes</Link>
      </div>
      <div>
        <Link href={ currentPath + "cars" }>Cars - Dynamic Routes using Route Segment Config</Link>
      </div>
      <div>
        <Link href={ currentPath + "dogs" }>Dogs - Dynamic Routes using Generated Params</Link>
      </div>

      <div className="m-4 h-full">
        { p.children }
      </div>

    </Browser>

    <Content />

  </>
}

export { layoutGeneratedAt }