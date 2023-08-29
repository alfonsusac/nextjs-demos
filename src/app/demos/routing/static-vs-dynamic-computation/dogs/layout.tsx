import { GenerateRandomLink } from "@/components/client"
import { InlineLink } from "@/components/link"

const currentPath = '/demos/routing/static-vs-dynamic-computation/dogs/'

export default function Layout(p: { children: React.ReactNode }) {

  return <>
    <h1>🐕‍🦺 Dogs</h1>
    <p>
      This page shows how dynamic routing can also be statically
      precomputed using <code>generateStaticParams()</code>
    </p>
    <p>
      In the example below, only <b>Labrador</b> and <b>Pomeranian</b> are statically generated at build time. 
    </p>
    <p>
      The rest will be generated at request time.
    </p>

    <nav>
      <InlineLink href={ currentPath }>Code</InlineLink>
      <span className="text-zinc-600 m-0">|</span>
      <InlineLink href={ currentPath + "Labrador" }>Labrador</InlineLink>
      <InlineLink href={ currentPath + "Pomeranian" }>Pomeranian</InlineLink>
      <InlineLink href={ currentPath + "Pug" } useAnchor>Pug (No Caching)</InlineLink>
      <GenerateRandomLink href={ currentPath } useAnchor>Random ID</GenerateRandomLink>
    </nav>

    { p.children }
  </>
}