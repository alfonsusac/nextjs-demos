export default function Layout(p: {
  children: React.ReactNode
}) {

  return (
    <div className="bg-red-200">
      Nested Layout for dynamic page/slug
      { p.children }
    </div>
  )
}