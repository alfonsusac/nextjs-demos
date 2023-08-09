import { RichTextItemResponse, RichTextPropertyItemObjectResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { JSONStringify } from "./tool"
import clsx from "clsx"

export function NotionRichText(p: {
  rich_text: RichTextItemResponse[]
}) {
  return p.rich_text.map((t, i) => {
    if (t.type === 'text') {
      
      if (t.text.link) {
        // WIP
        return <JSONStringify key={ i } data={ t } />
      }

      const { bold, italic, strikethrough, underline, code, color } = t.annotations

      if (!bold && !italic && !strikethrough && !underline && !code && color === 'default')
        return t.text
      
      else {
        return <span key={ i } className={ clsx(
          '',
          bold && 'font-bold',
          italic && 'italic',
          strikethrough && 'line-through',
          underline && 'underline',
          code && '',
          color === 'red'  && '',
        )}>
          {t.text.content}
        </span>
      }


    } else if (t.type === 'equation') {
      // WIP
      return <JSONStringify key={ i } data={ t } />
    } else if (t.type === 'mention') {
      // WIP
      return <JSONStringify key={ i } data={ t } />
    }
  })
}