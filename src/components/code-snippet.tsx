
export default function CodeSnippet(p: {
  filepath: string,
  code: JSX.Element,
}) {
  const textspans = p.filepath.split('/')

  return (
    <div className="border border-zinc-800 rounded-lg">
      <div className="p-3 text-xs text-zinc-400 px-4">
        { textspans.map((t, i) =>
          i === 0 ? <span key={ i }>{ t }</span> : 
          <>
            <span key={ 2*i }>/</span>
            <span key={ 2*i+1 }>{ t }</span>
          </>) }
      </div>
      { p.code }
    </div>
  )
}