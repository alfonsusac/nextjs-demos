import { InlineLink } from "@/components/link"

const currentPath = '/1-routing/static-vs-dynamic-computation/cars/'

export default function Layout(p: { children: React.ReactNode }) {

  return <>
    <h1>🚗 Cars</h1>
    <p>
      This page shows how dynamic routing can also be statically precomputed at build-time specifically using { "\"" }Route Segment Config{ "\"" }.
    </p>
    <nav>
      <InlineLink href={ currentPath }>Code</InlineLink>
      <span className="text-zinc-600 m-0">|</span>
      <InlineLink href={ currentPath + "BMW" }>BMW</InlineLink>
      <InlineLink href={ currentPath + "Nissan" }>Nissan</InlineLink>
      <InlineLink href={ currentPath + "Ford" }>Ford</InlineLink>
    </nav>

    { p.children }
  </>
}
