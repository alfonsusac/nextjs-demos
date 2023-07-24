import Link from "next/link"
import CodeSnippet from "@/components/code-snippet"
import DynamicRouteTurnedStaticCode from "./code.mdx"
import DynamicRouteTurnedStaticClientCode from "./code_client.mdx"

const currentPath = '/1-routing/static-vs-dynamic-computation/cars/'

export default function Layout(p: { children: React.ReactNode }) {

  return <>
    <h1 className="text-xl py-2">
      Cars
    </h1>
    <p>
      This page shows how dynamic routing can also be statically precomputed at build-time
    </p>

    <CodeSnippet
      filepath="app/cars/[carID]/page.js"
      code={ <DynamicRouteTurnedStaticCode /> }
    />
    <CodeSnippet
      filepath="client.js"
      code={ <DynamicRouteTurnedStaticClientCode /> }
    />

    <div className="pt-4">

      <span>[carID]: </span>

      <Link className="px-2" href={ currentPath + "BMW" }>
        BMW
      </Link>
      <Link className="px-2" href={ currentPath + "Nissan" }>
        Nissan
      </Link>
      <Link className="px-2" href={ currentPath + "Ford" }>
        Ford
      </Link>

    </div>

    <div className="mt-4">
      { p.children }
    </div>
  </>
}