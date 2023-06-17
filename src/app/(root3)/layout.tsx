export default function Layout(p: {
  children: React.ReactNode
}) {

  return (
    <div className="bg-green-200">
      Root3 Layout
      { p.children }
    </div>
  )
}