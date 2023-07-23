
export default function CodeSnippet(p: {
  filepath: string,
  code: JSX.Element,
}) {
  const textspans = p.filepath.split('/')

  return (
    <div className="border border-zinc-800 rounded-lg">
      <div className="p-3 text-xs text-zinc-400 px-4">
        { textspans.map((t, i) =>
          <>
            <span>/</span>
            <span key={ i }>{ t }</span>
          </>) }
      </div>
      { p.code }
    </div>
  )
}