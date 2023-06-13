export default async function Page1Page({ children }: any) {

  await new Promise((res) => setTimeout(res, 2000))

  return (
    <div className="p-10">
      <div>Hey itssa nested Layout</div>
      { children }
    </div>
  )
}