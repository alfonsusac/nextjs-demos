import { CalloutBlockObjectResponse, RichTextItemResponse, RichTextPropertyItemObjectResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { JSONStringify } from "../tool"
import clsx from "clsx"
import Image from "next/image"

export function flattenRichText(rt?: RichTextItemResponse[]) {
  return rt?.map(r => r.plain_text).join('')
}

export function NotionCalloutIcon({
  icon
}: {
  icon: CalloutBlockObjectResponse['callout']['icon']
}) {
  if (!icon) return <></>
  
  if (icon.type === 'emoji')
    return <span>{ icon.emoji }</span>

  if (icon.type === 'external')
    return <Image 
      alt='Callout Icon'
      width={24}
      height={24}
      src={ icon.external.url }

    />
  
  if (icon.type === 'file')
    return <Image
      alt='Callout Icon'
      width={ 24 }
      height={ 24 }
      src={ icon.file.url }
    />

}


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
        return <>{t.plain_text}</>
      
      else {
        return <span key={ i } className={ clsx(
          '',
          bold && 'font-bold',
          italic && 'italic',
          strikethrough && 'line-through',
          underline && 'underline',
          code && '',
          color === 'red' && '',
        ) }>
          { t.text.content }
        </span>
      }


    } else if (t.type === 'equation') {
      // WIP
      return <JSONStringify key={ i } data={ t } />
    } else if (t.type === 'mention') {
      // WIP
      return <JSONStringify key={ i } data={ t } />
    } else {
      return <></>
    }
  })
}

export function NotionFigureCaption(p: {
  caption: RichTextItemResponse[]
  center?: true
}) {
  return (
    <>
      {
        p.caption ? (
          <div className={
            clsx(
              "text-sm text-zinc-400 mt-2 w-full",
              p.center ? 'mx-auto text-center' : ""
            ) }>
            <NotionRichText rich_text={ p.caption } />
          </div>
        ) : null
      }
    </>

  )
}