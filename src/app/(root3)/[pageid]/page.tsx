export default function Page({ params }: any) {

  return (
    <div>
      Nested Page for dynamic page/slug:  { params.pageid }
    </div>
  )
}