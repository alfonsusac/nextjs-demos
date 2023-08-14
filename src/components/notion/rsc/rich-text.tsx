import { CalloutBlockObjectResponse, EquationRichTextItemResponse, MentionRichTextItemResponse, RichTextItemResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import clsx from "clsx"
import Image from "next/image"
import { twMerge } from "tailwind-merge"
import { KaTeXRSC } from "../../katex/rsc"
import { getMetaInfo } from "../../metadata/util"
import { AtInlineSymbol, CalendarInlineIcon, DatabasePageIcon, MaterialSymbolsPerson, PhGlobe, PhNotionLogoFill } from "../../svg"
import { formatRelative } from "date-fns"
import { InlineMentionTooltip } from "../client"

type Annotation = RichTextItemResponse['annotations']

export function flattenRichText(rt?: RichTextItemResponse[]) {
  return rt?.map(r => r.plain_text).join('')
}

export function NotionIcon({
  icon,
  className
}: {
  icon: CalloutBlockObjectResponse['callout']['icon']
  className?: string
}) {
  if (!icon) return <></>

  if (icon.type === 'emoji')
    return <span
      className={ className }
      style={ {
        height: '1em',
        width: '1em',
        // margin: '0 .05em 0 .1em',
        verticalAlign: '-0.1em'
      } }
    >
      { icon.emoji }
    </span>

  if (icon.type === 'external')
    // eslint-disable-next-line @next/next/no-img-element
    return <img
      alt='Callout Icon'
      className={ clsx("inline", className)}
      src={ icon.external.url }
      style={ {
        height: '1em',
        width: '1em',
        // margin: '0 .05em 0 .1em',
        verticalAlign: '-0.1em'
      } }
    />

  if (icon.type === 'file')
    // eslint-disable-next-line @next/next/no-img-element
    return <img
      alt='Callout Icon'
      className={ clsx("inline", className) }
      src={ icon.file.url }
      style={ {
        height: '1em',
        width: '1em',
        // margin: '0 .05em 0 .1em',
        verticalAlign: '-0.1em'
      } }
    />
  // https://www.notion.so/alfonsusardani/Text-Notion-at-Next-js-Article-Part-V-9c3d8892ae384cd782585c041cba9c7b?pvs=4#89bbb406c1614043950a01f005da8afc
}

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type ImageObject = {
  type: "file"
  file: {
    url: string
    expiry_time: string
  }
} | {
  type: "external"
  external: {
    url: string
  }
}

export function NotionImage({
  nprop,
  alt,
  ...props
}: {
  nprop: ImageObject
  alt: string
} & Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<
      HTMLImageElement
    >, HTMLImageElement
  >, 'src' | 'alt'
>) {
  if (!nprop) return

  const url =
    'external' in nprop ? nprop.external.url :
      'file' in nprop ? nprop.file.url : ''


  // eslint-disable-next-line @next/next/no-img-element
  return <img
    src={ url }
    alt={ alt }
    { ...props }
  />
}

export function NotionRichText(p: {
  rich_text: RichTextItemResponse[]
}) {
  return p.rich_text.map((t, i) => {

    const annotationCN = annotationToClassName('', t.annotations)
    const { bold, italic, strikethrough, underline, code, color } = t.annotations
    const isUnformatted = !bold && !italic && !strikethrough && !underline && !code && color === 'default'

    switch (t.type) {
      case 'text':
        return <InlineText key={ i } />
      case 'equation':
        return <InlineEquation key={ i } />
      case 'mention':
        return <InlineMention key={ i } />
      default:
        return <></>
    }



    function InlineText() {
      const href = t.href
      const { text } = (t as TextRichTextItemResponse)
      return (
        href
          ? (
            <InlineMentionTooltip content={
              <>
                <PhGlobe className="inline text-zinc-600 mr-1 leading mb-1" />
                { href }
              </>
            }>
              <a className={ annotationCN } href={ href }>
                { text.content }
              </a>
            </InlineMentionTooltip>
          ) : isUnformatted
            ? (<>{ text.content }</>)
            : (<span className={ annotationCN }>{ text.content }</span>)
      )
    }

    function InlineEquation() {
      const { expression } = (t as EquationRichTextItemResponse).equation
      return <KaTeXRSC key={ i }
        className={ annotationCN }
        math={ expression }
        settings={ { strict: false } }
      />
    }

    async function InlineMention() {
      const mention = (t as MentionRichTextItemResponse).mention

      const inlinePaddingCN = `no-underline inline items-center rounded-[2px] relative`
      const inlineHoverCN = 'hover:bg-[#1F1F22] hover:shadow-[0px_0px_0px_3px_#1F1F22]'

      switch (mention.type) {


        case 'database':
          return (
            <a
              href={ t.href! }
              className={
                clsx(annotationCN, inlinePaddingCN, inlineHoverCN, '')

              }
            >
              <span className="h-full inline-block text-zinc-600 text-sm pr-0.5">
                <DatabasePageIcon className="inline text-lg text-zinc-600 mb-1" />
              </span>
              <span className="decoration-zinc-600 text-zinc-300 underline">
                { t.plain_text }
              </span>
            </a>
          )


        case 'date':
          const startDate = new Date(mention.date.start)
          const endDate = mention.date.end ? new Date(mention.date.end) : undefined
          const includeTime = mention.date.start.includes('T')
          const now = new Date()

          const start = formatRelative(startDate, now)
          const end = endDate ? formatRelative(endDate, now) : undefined
          return (
            <InlineMentionTooltip content={
              <>
                <CalendarInlineIcon className="inline text-zinc-600 mr-1 leading mb-1" />
                {
                  mention.date.start + (endDate ? ` → ${mention.date.end}` : '')
                }
              </>
            }>
              <span className={ clsx(annotationCN, inlinePaddingCN, inlineHoverCN, 'hover:tex-zinc-300') }>
                <span className="h-full inline text-zinc-600 text-sm pr-0.5">
                  <AtInlineSymbol className="inline text-lg mb-1" />
                </span>
                <span className="decoration-zinc-600 text-zinc-400">
                  {
                    includeTime ? (
                      `${start} ${end ? ' → ' + end : ''}`
                    ) : (
                      `${start.split(' at ')[0]} ${end ? ' → ' + end.split(' at ')[0] : ''}`
                    )
                  }
                </span>
              </span>
            </InlineMentionTooltip>
          )


        case 'link_preview':
          const metadata = await getMetaInfo(t.href!)
          return (
            <a className={ clsx(annotationCN, inlinePaddingCN, inlineHoverCN) } href={ t.href! } target="_blank">
              <span className="h-full inline-block text-zinc-300 text-sm pr-0.5">
                {// eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={ metadata.url?.hostname }
                    className="inline text-lg mb-1 w-4 h-4 rounded-sm"
                    src={ metadata.faviconpath }
                  /> }
              </span>
              <span className="decoration-zinc-600 text-zinc-400">
                { metadata.title }
              </span>
            </a>
          )


        case 'page':
          return (
            <a className={ clsx(annotationCN, inlinePaddingCN, inlineHoverCN) } href={ t.href! } target="_blank">
              <span className="h-full inline-block text-zinc-300 text-sm pr-0.5">
                <PhNotionLogoFill className="inline text-lg mb-1" />
              </span>
              <span className="decoration-zinc-600 text-zinc-400">
                { t.plain_text }
              </span>
            </a>
          )


        case 'user':

          if ('type' in mention.user) {

            return (
              <InlineMentionTooltip content={
                <>
                  <MaterialSymbolsPerson className="inline text-zinc-600 mr-1 leading mb-1" />
                  Person
                </>
              }>
                <span className={ clsx(annotationCN, inlinePaddingCN, inlineHoverCN, 'hover:tex-zinc-300') }>
                  <span className="h-full inline text-zinc-600 text-sm pr-0.5">
                    <AtInlineSymbol className="inline text-lg mb-1" />
                  </span>
                  <span className="decoration-zinc-600 text-zinc-400">
                    { mention.user.name }
                  </span>
                </span>
              </InlineMentionTooltip>
            )


          } else return <></>

        default:
          return <></>
      }
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

