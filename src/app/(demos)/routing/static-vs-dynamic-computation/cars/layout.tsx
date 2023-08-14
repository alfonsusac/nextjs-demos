import { GenerateRandomLink } from "@/components/client"
import { InlineLink } from "@/components/link"
import { nanoid } from "nanoid"

const currentPath = '/routing/static-vs-dynamic-computation/cars/'

export default function Layout(p: { children: React.ReactNode }) {

  return <>
    <h1>🚗 Cars</h1>
    <p>
      This page shows how dynamic routing can be statically precomputed using { "\"" }force-static{ "\"" }.
    </p>
    <nav>
      <InlineLink href={ currentPath }>Code</InlineLink>
      <span className="text-zinc-600 m-0">|</span>
      <InlineLink href={ currentPath + "BMW" } >BMW</InlineLink>
      <InlineLink href={ currentPath + "Nissan" } >Nissan</InlineLink>
      <InlineLink href={ currentPath + "Ford" } prefetch={ false }>Ford (No prefetch)</InlineLink>
      <InlineLink href={ currentPath + "Hyundai" } useAnchor>Hyundai (No caching)</InlineLink>
      <GenerateRandomLink href={ currentPath } useAnchor>Random ID</GenerateRandomLink>
    </nav>

    { p.children }
  </>
}
