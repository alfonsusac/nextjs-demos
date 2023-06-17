export default function Layout(p: {
  children: React.ReactNode
}) {

  return (
    <div className="bg-slate-200">
      Root1 Layout
      { p.children }
    </div>
  )
}