export default function Layout(p: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full mx-4">
      {/* LEFT */ }
      { p.children }
    </div>
  )
}