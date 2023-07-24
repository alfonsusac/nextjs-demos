
export default function CodeSnippet(p: {
  filepath: string,
  code: JSX.Element,
}) {
  const textspans = p.filepath
    .split('/')
    .reduce((acc, val, i) => {
      if (i === 0) acc.push(val)
      else acc.push('/', val)
      return acc
    }, [] as string[])

  return (
    <div className="border border-zinc-800 rounded-lg my-4">
      <div className="p-3 text-xs text-zinc-400 px-4 flex gap-1">
        {
          textspans.map((t, i) =>
            t === '/' ?
              <span key={ i }>/</span> :
              <span key={ i }>{ t }</span>
          )
        }
      </div>
      { p.code }
    </div>
  )
}