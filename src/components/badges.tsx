export function GenerationTime(p: {
  seconds: number
}) {
  return (
    <div className="mb-2">
      <span className="text-sm text-zinc-300 bg-zinc-900 p-1 px-2 rounded-md">Generated <b>{ p.seconds } seconds late</b> from parent layout.</span>
    </div>
  )
}