import { B, D } from "@/components/client"

export default async function Page1Page({ params }: any) {

  await new Promise((res) => setTimeout(res, 100))

  const rando = Math.random()

  return (
    <section className="page">
      <div>
        Subpage
        
      </div>
      <D>Invalidate Everything with Transition</D>
    </section>
  )
}