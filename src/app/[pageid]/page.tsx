import { addGlobal, getRandomNumber } from "@/components/server"
import { redirect } from "next/navigation"

export default async function Page1Page({ params }: any) {

  await new Promise((res) => setTimeout(res, 100))
  
  return (
    <section className="page">
      <div>Dynamic Page <code>{ params.pageid! }</code></div>
      <p>Cached: { getRandomNumber() } | GC: { addGlobal() }</p>
    </section>
  )

}