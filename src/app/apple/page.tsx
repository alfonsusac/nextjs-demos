import { E } from "@/components/client"

export default async function Page1Page() {
  
  await new Promise((res)=> setTimeout(res, 2000))

  return (
    <section className="page">
      <div>Apple Page</div>
      <p>{ Math.random() }</p>
      <E>Invalidate Apple Page</E>
    </section>
  )
}