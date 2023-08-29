import { GenerateRandomLink } from "@/components/client"
import { InlineLink } from "@/components/link"

const currentPath = '/demos/routing/static-vs-dynamic-computation/cars/'

export default function Layout(p: { children: React.ReactNode }) {

  return <>
    <h1>🚗 Cars</h1>
    <p>
      This page shows how dynamic routing can be statically precomputed using { "\"" }force-static{ "\"" }.
    </p>
    <p>
      However, none of the params are known at build time.
    </p>
    <p>
      So all route are statically rendered at request time.
    </p>
    <nav>
      <InlineLink href={ currentPath }>Code</InlineLink>
      <span className="text-zinc-600 m-0">|</span>
      <InlineLink href={ currentPath + "BMW" } useAnchor>BMW</InlineLink>
      <InlineLink href={ currentPath + "Nissan" } useAnchor>Nissan</InlineLink>
      <InlineLink href={ currentPath + "Hyundai" } useAnchor>Hyundai </InlineLink>
      <GenerateRandomLink href={ currentPath } useAnchor>Random ID</GenerateRandomLink>
    </nav>

    { p.children }
  </>
}
