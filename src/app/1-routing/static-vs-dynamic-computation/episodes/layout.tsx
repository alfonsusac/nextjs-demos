import { GenerateRandomLink } from "@/components/client"
import { InlineLink } from "@/components/link"

const currentPath = '/1-routing/static-vs-dynamic-computation/episodes/'

export default function Layout(p: { children: React.ReactNode }) {

  return <>
    <h1>🎥 Episodes</h1>
    <p>
      This page shows how to keep dynamic routes 100% statically
      precomputed at build-time  <code>generateStaticParams()</code> and <code>dynamicParams = false</code>
    </p>
    <p>
      In the example below, only <b>The first two episodes</b> are statically generated. The rest will show a notFound component.
    </p>
    <p>
      Do note that not-found only works on production as in development mode, everything is rendered at request time.
    </p>

    <nav>
      <InlineLink href={ currentPath }>Code</InlineLink>
      <span className="text-zinc-600 m-0">|</span>
      <InlineLink href={ currentPath + "1" }>Episode 1</InlineLink>
      <InlineLink href={ currentPath + "2" }>Episode 2</InlineLink>
      <InlineLink href={ currentPath + "120" }>Episode 120</InlineLink>
    </nav>

    { p.children }
  </>
}