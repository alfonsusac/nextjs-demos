export default async function Page1Page({ params }: any) {

  await new Promise((res) => setTimeout(res, 2000))

  return (
    <div className="p-4">
      <div>Now im in test</div>
      { JSON.stringify(params) }
    </div>
  )
}