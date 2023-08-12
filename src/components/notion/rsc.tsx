import { CalloutBlockObjectResponse, RichTextItemResponse, RichTextPropertyItemObjectResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { JSONStringify } from "../tool"
import clsx from "clsx"
import Image from "next/image"
import { twMerge } from "tailwind-merge"
import { KaTeXRSC } from "../katex/rsx"
import { getMetaInfo } from "../metadata/util"
import { CalendarInlineIcon, DatabasePageIcon } from "../svg"

type Annotation = RichTextItemResponse['annotations']

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
      width={ 24 }
      height={ 24 }
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


  return p.rich_text.map(async (t, i) => {
    const annotatedClassNames = annotationToClassName('', t.annotations)
    if (t.type === 'text') {

      if (t.text.link) {
        return <a
          key={ i }
          className={ annotatedClassNames }
          href={ t.href! }
        >
          { t.text.content }
        </a>
      }

      const { bold, italic, strikethrough, underline, code, color } = t.annotations

      if (!bold && !italic && !strikethrough && !underline && !code && color === 'default')
        return <>{ t.plain_text }</>
      else {
        return <span key={ i } className={ annotatedClassNames }>
          { t.text.content }
        </span>
      }


    } else if (t.type === 'equation') {
      // WIP
      return <KaTeXRSC key={ i }
        className={ annotatedClassNames }
        math={ t.equation.expression.replace(/[\uE000-\uF8FF]/g, '') }
        settings={ {
          fleqn: true,
          strict: false,
        } }
      />
    } else if (t.type === 'mention') {
      if (t.mention.type === 'database') {
        return (
          <a
            href={ t.href! }
            key={ i }
            className={ annotationToClassName('no-underline inline-flex flex-row items-center px-2.5 hover:bg-zinc-800/80 rounded-md ', t.annotations) }
          >
            <DatabasePageIcon className="inline mr-1.5 text-zinc-600" />
            <span className="decoration-zinc-600 underline font-medium text-zinc-300">
              { t.plain_text }
            </span>
          </a>
        )
      } else if (t.mention.type === 'date') {
        return (
          <span
            key={ i }
            className={ annotationToClassName('no-underline inline-flex flex-row items-center px-2.5 hover:bg-zinc-800/80 rounded-md ', t.annotations) }
          >
            <CalendarInlineIcon className="inline w-4 h-4 mr-1.5 text-zinc-600" />
            <span className="decoration-zinc-600 underline underline-offset-4 font-medium text-zinc-300">
              { t.plain_text }
            </span>
          </span>
        )
      } else if (t.mention.type === 'link_preview') {
        const metadata = await getMetaInfo(t.href!)
        return (
          <span
            key={ i }
            className={ annotatedClassNames }
          >
            {
              metadata.title
            }
          </span>
          // <JSONStringify key={ i } data={ t } />
        )
      } else if (t.mention.type === 'page') {
        return (
          <a
            href={ t.href! }
            key={ i }
            className={ annotatedClassNames }
          >
            {
              t.plain_text
            }
          </a>
        )
      } else if (t.mention.type === 'template_mention') {
        return (
          <JSONStringify key={ i } data={ t } />
        )
      } else if (t.mention.type === 'user') {
        return (
          <span
            key={ i }
            className={ annotatedClassNames }
          >
            {
              (t.mention.user as any).avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className='w-4 h-4 inline rounded-full'
                  src={ (t.mention.user as any).avatar_url }
                  alt={ (t.mention.user as any).name + "'s profile picture" }
                />
              ) : (
                <div
                  className='w-4 h-4 inline rounded-full bg-zinc-700'
                />
              )
            }
            <span>
              { (t.mention.user as any).name }
            </span>
          </span>
        )
      } else {
        return (
          <JSONStringify key={ i } data={ t } />
        )
      }
    } else {
      return (
        <JSONStringify key={ i } data={ t } />
      )
    }
  })
}

function annotationToClassName(className: string, annotation: Annotation) {
  return twMerge(
    clsx(
      'm-0 p-0',
      annotation.bold ?
        'font-semibold text-white' : '',
      annotation.italic ?
        'italic' : '',
      annotation.strikethrough ?
        'line-through' : '',
      annotation.underline ?
        'underline' : '',
      annotation.code ?
        'font-mono text-sm p-1 bg-zinc-800 rounded-md ' : '',
      colorToTw[annotation.color],
      className,
    )
  )
}

const colorToTw: {
  [key in Annotation['color']]: string
} = {
  default: "",
  gray: "text-zinc-500",
  brown: "text-yellow-800",
  orange: "text-orange-500",
  yellow: "text-yellow-400",
  green: "text-green-500",
  blue: "text-blue-500",
  purple: "text-purple-500",
  pink: "text-pink-500",
  red: "text-red-500",
  gray_background: "bg-zinc-800/50",
  brown_background: "bg-yellow-900/50",
  orange_background: "bg-orange-800/50",
  yellow_background: "bg-yellow-800/50",
  green_background: "bg-green-800/50",
  blue_background: "bg-blue-800/50",
  purple_background: "bg-purple-800/50",
  pink_background: "bg-pink-800/50",
  red_background: "bg-red-800/50"
}

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
    <>
      {
        p.caption ? (
          <div className={
            twMerge(clsx(
              "text-sm text-zinc-400 mt-2 w-full",
              center ? 'mx-auto text-center' : "",
              className,
            )) }
            { ...props }
          >
            <NotionRichText rich_text={ caption } />
          </div>
        ) : null
      }
    </>

  )
}

