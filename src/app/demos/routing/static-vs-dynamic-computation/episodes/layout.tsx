import { InlineLink } from "@/components/link"

const currentPath = '/demos/routing/static-vs-dynamic-computation/episodes/'

export default function Layout(p: { children: React.ReactNode }) {

  return <>
    <h1>🎥 Episodes</h1>
    <p>
      This page shows how to keep dynamic routes 100% statically
      precomputed at build-time  <code>generateStaticParams()</code> and <code>dynamicParams = false</code>
    </p>
    <p>
      In the example below, only <b>The first two episodes</b> are statically generated at build time.
    </p>
    <p>
      The rest will throw a global notfound route.
    </p>


    <nav>
      <InlineLink href={ currentPath }>Code</InlineLink>
      <span className="text-zinc-600 m-0">|</span>
      <InlineLink href={ currentPath + "1" } useAnchor>Episode 1</InlineLink>
      <InlineLink href={ currentPath + "2" } useAnchor>Episode 2</InlineLink>
      <InlineLink href={ currentPath + "120" } useAnchor>Episode 120</InlineLink>
    </nav>

    { p.children }


  </>
}