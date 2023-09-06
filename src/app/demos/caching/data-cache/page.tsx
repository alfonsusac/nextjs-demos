const currentPath = '/routing/static-vs-dynamic-computation/books/'



export default async function Page() {

  const res = await fetch('/api/getData')
  const data = await res.json()

  const renderTime = new Date()

  return <>

    <h1>❔ Acme Inc.</h1>
    <p>
      This demo shows the difference in behavior between all the settings involved in caching a data using the Data Cache
    </p>
    <p>
      This route is statically computed hence it uses build cache by default
    </p>
    

  </>
}