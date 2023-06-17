export default function Layout(p: {
  children: React.ReactNode
}){

  return (
    <div className="bg-yellow-200">
      Root2 Layout
      {p.children}
    </div>
  )
}