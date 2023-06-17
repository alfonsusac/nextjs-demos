import Image from 'next/image'

export default async function Home() {

  await new Promise((res) => setTimeout(res, 100))
  
  return (
    <section className="page">
      <div>
        Root page
      </div>
    </section>
  )
}
