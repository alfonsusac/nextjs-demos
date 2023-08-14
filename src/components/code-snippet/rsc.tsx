import { Code } from "bright"
import { getFileSpans } from "./util"
import { MdiCodeJson } from "./client"

export function CodeRSC(p: {
  language: string,
  title?: string,
  code: string
}) {
  return (
    <Code
      lang={ p.language }
      theme="one-dark-pro"
      title={ p.title }
      className='border border-zinc-800 rounded-lg my-4 relative w-full bg-black'
      codeClassName='p-0 -mt-1'
      extensions={ [
        {
          name: 'titleBar',
          TitleBarContent(props) {
            const { title, colors, theme } = props
            const { editor, background } = colors
            const textspans = getFileSpans(title ?? '')
            return (
              <label
                className="p-3 text-xs text-zinc-400 px-4 flex justify-between bg-black w-full"
                htmlFor={ title }
              >
                <div className="flex gap-1">
                  <MdiCodeJson className="h-full mr-2" />
                  {
                    textspans.map((t, i) =>
                      t === '/' ?
                        <span key={ i }>/</span> :
                        <span key={ i }>{ t }</span>
                    )
                  }
                </div>
              </label>
            )
          }
        },
      ] }
      code={p.code}
    />
  )
}