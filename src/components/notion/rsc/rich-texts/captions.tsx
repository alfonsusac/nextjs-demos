import { cn } from "@/components/typography"
import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { NotionRichText } from "./parser"


export function NotionFigureCaption(p: {
  caption: RichTextItemResponse[]
  center?: true
} & React.DetailedHTMLProps<
  React.HTMLAttributes<
    HTMLDivElement
  >, HTMLDivElement
>
) {
  const { className, caption, center, ...props } = p
  return (
    p.caption ? (
      <div className={ cn(
        "text-sm text-zinc-400 mt-2 w-full",
        center ? 'mx-auto text-center' : "",
        className,
      ) }
        { ...props }
      >
        <NotionRichText rich_text={ caption } />
      </div>
    ) : null

  )
}

