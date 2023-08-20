import { EquationRichTextItemResponse, MentionRichTextItemResponse, RichTextItemResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"
import { KaTeXRSC } from "../../katex/rsc"
import { getMetaInfo } from "../../metadata/util"
import { AtInlineSymbol, CalendarInlineIcon, DatabasePageIcon, MaterialSymbolsPerson, PhGlobe, PhNotionLogoFill } from "../../svg"
import { formatRelative } from "date-fns"
import { InlineMentionTooltip } from "../client"
import { notion } from "../data"
import { slug } from "github-slugger"

type Annotation = RichTextItemResponse['annotations']

export function flattenRichText(rt?: RichTextItemResponse[]) {
  return rt?.map(r => r.plain_text).join('')
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



    async function InlineText() {
      const href = t.href
      const { text } = (t as TextRichTextItemResponse)
      const content = text.content.split('\n').map((c, i) => i ? [<br key={ i } />, c] : c)
      return (
        href
          ? (
            <InlineMentionTooltip content={
              <>
                <PhGlobe className="inline text-zinc-600 mr-1 leading mb-1" />
                { href }
              </>
            }>
              <a className={ annotationCN } href={ await parseNotionHref(href) }>
                { content }
              </a>
            </InlineMentionTooltip>
          ) : isUnformatted
            ? (<>{ content }</>)
            : (<span className={ annotationCN }>{ content }</span>)
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

async function parseNotionHref(c: string) {
  if (c.startsWith('/')) {
    const blockid = c.split('#')[1]
    try {
      const blockdata = await notion.blocks.retrieve({
        block_id: blockid
      }) as any
      const rich_text = blockdata[blockdata.type!].rich_text as RichTextItemResponse[]
      const text = flattenRichText(rich_text)!
      const anchorlink = `#${slug(text)}`
      return anchorlink
    } catch (error) {
      console.log(error)
      return c      
    }
  } else {
    return c
  }
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
      convertColorToClassname(annotation.color),
      className,
    )
  )
}

export type ApiColor = Annotation['color']

export function convertColorToClassname(color?: ApiColor) {
  switch (color) {
    case 'default': return ''
    case 'gray': return "text-zinc-500"
    case 'brown': return "text-yellow-800"
    case 'orange': return "text-orange-500"
    case 'yellow': return "text-yellow-400"
    case 'green': return "text-green-500"
    case 'blue': return "text-blue-500"
    case 'purple': return "text-purple-500"
    case 'pink': return "text-pink-500"
    case 'red': return "text-red-500"
    case 'gray_background': return "bg-zinc-800/50"
    case 'brown_background': return "bg-yellow-900/50"
    case 'orange_background': return "bg-orange-800/50"
    case 'yellow_background': return "bg-yellow-800/50"
    case 'green_background': return "bg-green-800/50"
    case 'blue_background': return "bg-blue-800/50"
    case 'purple_background': return "bg-purple-800/50"
    case 'pink_background': return "bg-pink-800/50"
    case 'red_background': return "bg-red-800/50"
    default: return
  }
}

// export const colorToTw: {
//   [key in ApiColor]: string
// } = {
//   default: "",
//   gray: "text-zinc-500",
//   brown: "text-yellow-800",
//   orange: "text-orange-500",
//   yellow: "text-yellow-400",
//   green: "text-green-500",
//   blue: "text-blue-500",
//   purple: "text-purple-500",
//   pink: "text-pink-500",
//   red: "text-red-500",
//   gray_background: "bg-zinc-800/50",
//   brown_background: "bg-yellow-900/50",
//   orange_background: "bg-orange-800/50",
//   yellow_background: "bg-yellow-800/50",
//   green_background: "bg-green-800/50",
//   blue_background: "bg-blue-800/50",
//   purple_background: "bg-purple-800/50",
//   pink_background: "bg-pink-800/50",
//   red_background: "bg-red-800/50"
// }

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

