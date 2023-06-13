export default async function Page1Page() {
  
  await new Promise((res)=> setTimeout(res, 2000))

  return (
    <>Aha</>
  )
}