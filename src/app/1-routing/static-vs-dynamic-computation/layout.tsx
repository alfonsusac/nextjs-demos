import { Browser } from "@/components/browser"
import Content from "./content.mdx"
import { ReactNode } from "@mdx-js/react/lib"
import Link from "next/link"

const currentPath = '/1-routing/static-vs-dynamic-computation/'

export default function Layout(p: { children: ReactNode }) {

  return <>
    <Browser>
      
      <div>
        <Link href={"/1-routing/static-vs-dynamic-computation"}>Home</Link>
      </div>
      <div>
        <Link href={currentPath + "books"}>Books (Dynamic Routes)</Link>
      </div>
      <div>
        <Link href={currentPath + "cars"}>Cars (Dynamic Routes using Route Segment Config)</Link>
      </div>

      <div className="p-4">
        {p.children}
      </div>
    </Browser>
    <Content />
  </>
}