import { Code } from "bright"
import { getFileSpans } from "./util"
import { MdiCodeJson } from "./client"
import { cn } from "../typography"


export function CodeRSC(p: {
  language: string,
  title?: string,
  code: string
}) {
  return (
    <Code
      lang={ p.language }
      // theme="one-dark-pro"
      theme='github-dark-dimmed'
      title={ p.title }
      className={ cn(
        'bg-zinc-900 rounded-lg relative',
        'p-3 left-0 right-0',
        'prose-pre:!m-0',
        'prose-pre:!bg-inherit',
        'prose-pre:rounded-none',
        'prose-pre:border-none',
      ) }
      codeClassName='p-0 -my-1'
      extensions={ [
        {
          name: 'titleBar',
          TitleBarContent(props) {
            const { title, colors, theme } = props
            const { editor, background } = colors
            const textspans = getFileSpans(title ?? '')
            return (
              <label
                className="p-3 text-xs text-zinc-400 px-6 flex justify-between bg-black w-full"
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
          },
        },
      ] }
      code={p.code}
    />
  )
}