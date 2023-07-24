import { InlineLink } from "@/components/link"

const currentPath = '/1-routing/static-vs-dynamic-computation/dogs/'

export default function Layout(p: { children: React.ReactNode }) {

  return <>
    <h1>🐕‍🦺 Dogs</h1>
    <p>
      This page shows how dynamic routing can also be statically
      precomputed at build-time specifically using <code>generateStaticParams()</code>
    </p>
    <p>
      In the example below, only <b>Labrador</b> and <b>Pomeranian</b> are the only params that are statically generated. Retriever are prefetched using Link while on Pug prefetching is disabled.
    </p>

    <nav>
      <InlineLink href={ currentPath }>Code</InlineLink>
      <span className="text-zinc-600 m-0">|</span>
      <InlineLink href={ currentPath + "Labrador" }>Labrador</InlineLink>
      <InlineLink href={ currentPath + "Pomeranian" }>Pomeranian</InlineLink>
      <InlineLink href={ currentPath + "Retriever" }>Retriever (Prefetch)</InlineLink>
      <InlineLink href={ currentPath + "Pug" } useAnchor>Pug (No Caching)</InlineLink>
    </nav>

    { p.children }
  </>
}