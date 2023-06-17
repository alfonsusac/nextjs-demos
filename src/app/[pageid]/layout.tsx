import Timer, { A, B, C } from "@/components/client"
import { addGlobal, getRandomNumber } from "@/components/server"
import Link from "next/link"

let renderCount = 0;

export default async function Page1Page({ children, params }: any) {

  await new Promise((res) => setTimeout(res, 100))
  
  renderCount += 1;

  return (
    <section className="layout">

      <div>Nested Layout Dynamic Route</div>
      <p>{ Math.random() } | Render Count: { renderCount } | Cached: { getRandomNumber() } | GC: { addGlobal() }</p>
      <p><small>Best if you try to open in 2 tabs</small></p>

      <Timer />
      <Link href={`/${params.pageid}/`}>Index</Link>
      <Link href={ `/${params.pageid}/test` }>Subpage</Link>
      <a href={ `/${params.pageid}/test` }>Subpage via a tag</a>
      <A>Router Refresh</A>
      <B>Invalidate Everything</B>
      <C>Invalidate Everything with Transition</C>
      
      <section className="children">
        { children }
      </section>
    </section>
  )
}
