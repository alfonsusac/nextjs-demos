export default async function Pag2Page() {

  await new Promise((res) => setTimeout(res, 2000))

  return (
    <section className="page">
      <div>Banana Page</div>
    </section>
  )
}