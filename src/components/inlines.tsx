import clsx from "clsx"

export function Blue(p: {
  children: React.ReactNode
}) {
  return (
    <Highlight className="text-blue-400 bg-blue-800/30">
      {p.children}
    </Highlight>
  )
}
export function Purple(p: {
  children: React.ReactNode
}) {
  return (
    <Highlight className="text-purple-400 bg-purple-800/30">
      {p.children}
    </Highlight>
  )
}
export function White(p: {
  children: React.ReactNode
}) {
  return (
    <Highlight className="text-zinc-50 bg-zinc-800/30">
      {p.children}
    </Highlight>
  )
}

function Highlight(p: {
  children: React.ReactNode
  className: string
}) {
  return (
    <span className={"relative px-0 rounded-md " + p.className }>
      { p.children }
    </span>
  )
}

export function B(p: {
  children: React.ReactNode
}){
  return (
    <strong className="text-white font-bold underline-offset-4">
      {p.children}
    </strong>
  )
}

export function Callout(p:{
  children: React.ReactNode
}) {
  return (
    <section className="">
      {p.children}
    </section>
  )
}

export function LG(p: {
  children: React.ReactNode
}){
  return (
    <div className="text-lg pt-8">
      {p.children}
    </div>
  )
}