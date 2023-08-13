import { CalloutBlockObjectResponse, EquationRichTextItemResponse, MentionRichTextItemResponse, RichTextItemResponse, RichTextPropertyItemObjectResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { JSONStringify } from "../tool"
import clsx from "clsx"
import Image from "next/image"
import { twMerge } from "tailwind-merge"
import { KaTeXRSC } from "../katex/rsx"
import { getMetaInfo } from "../metadata/util"
import { AtInlineSymbol, CalendarInlineIcon, DatabasePageIcon, GithubInlineIcon, PhNotionLogoFill } from "../svg"
import { formatRelative } from "date-fns"
import { InlineMentionTooltip } from "./client"

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
  // https://www.notion.so/alfonsusardani/Text-Notion-at-Next-js-Article-Part-V-9c3d8892ae384cd782585c041cba9c7b?pvs=4#89bbb406c1614043950a01f005da8afc
}


export function NotionRichText(p: {
  rich_text: RichTextItemResponse[]
}) {
  return p.rich_text.map((t, i) => {

    const annotationCN = annotationToClassName('', t.annotations)
    const { bold, italic, strikethrough, underline, code, color } = t.annotations
    const isUnformatted = !bold && !italic && !strikethrough && !underline && !code && color === 'default'


    if (t.type === 'text') {
      return <InlineText key={ i } />
    }
    else if (t.type === 'equation') {
      return <InlineEquation key={ i } />
    }
    else if (t.type === 'mention') {
      return <InlineMention key={ i } />
    }


    //   } else if (t.mention.type === 'date') {
    //     //https://www.notion.so/alfonsusardani/Text-Notion-at-Next-js-Article-Part-V-9c3d8892ae384cd782585c041cba9c7b?pvs=4#6ecd81e152a54a8f9f40c9aaf9dc7f42

    //     const startDate = new Date(t.mention.date.start)
    //     const endDate = t.mention.date.end ? new Date(t.mention.date.end) : undefined
    //     const includeTime = t.mention.date.start.includes('T')
    //     const tz = t.mention.date.time_zone ? t.mention.date.time_zone : undefined
    //     const now = new Date()

    //     const start = formatRelative(startDate, now)
    //     const end = endDate ? formatRelative(endDate, now) : undefined



    //     return (
    //       <InlineMentionTooltip key={ i } content={
    //         t.mention.date.start + (endDate ? ` -> ${t.mention.date.end}` : '')
    //       }>
    //         <span
    //           className={ annotationToClassName(clsx(
    //             'no-underline inline-block items-center rounded-md relative',
    //             'before:absolute before:h-full before:hover:bg-zinc-800/80 before:rounded-md before:-z-10',
    //             'before:-mx-2 before:left-0 before:right-0',
    //             'cursor-help'
    //           ), t.annotations) }
    //         >
    //           <span className="h-full inline-block text-center">
    //             <CalendarInlineIcon className="inline w-4 h-4 mr-1 text-zinc-600 flex-shrink-0 mb-1" />
    //           </span>
    //           <span className="decoration-zinc-600 text-zinc-400">
    //           {
    //             includeTime ? (
    //               `${start} ${ end ? ' -> ' + end : '' }`
    //             ) : (
    //               `${start.split(' at ')[0]} ${ end ? ' -> ' + end.split(' at ')[0] : ''}`
    //             )
    //           }
    //             {/* { t.plain_text } */}
    //           </span>
    //         </span>
    //       </InlineMentionTooltip>
    //     )
    //   }
    //   else if (t.mention.type === 'link_preview') {
    //     const metadata = await getMetaInfo(t.href!)
    //     return (
    //       <span
    //         key={ i }
    //         className={ annotatedClassNames }
    //       >
    //         {
    //           metadata.title
    //         }
    //       </span>
    //       // <JSONStringify key={ i } data={ t } />
    //     )
    //   }
    //   else if (t.mention.type === 'page') {
    //     return (
    //       <a
    //         href={ t.href! }
    //         key={ i }
    //         className={ annotatedClassNames }
    //       >
    //         {
    //           t.plain_text
    //         }
    //       </a>
    //     )
    //   } else if (t.mention.type === 'template_mention') {
    //     return (
    //       <JSONStringify key={ i } data={ t } />
    //     )
    //   } else if (t.mention.type === 'user') {
    //     return (
    //       <span
    //         key={ i }
    //         className={ annotatedClassNames }
    //       >
    //         {
    //           (t.mention.user as any).avatar_url ? (
    //             // eslint-disable-next-line @next/next/no-img-element
    //             <img
    //               className='w-4 h-4 inline rounded-full'
    //               src={ (t.mention.user as any).avatar_url }
    //               alt={ (t.mention.user as any).name + "'s profile picture" }
    //             />
    //           ) : (
    //             <div
    //               className='w-4 h-4 inline rounded-full bg-zinc-700'
    //             />
    //           )
    //         }
    //         <span>
    //           { (t.mention.user as any).name }
    //         </span>
    //       </span>
    //     )
    //   } else {
    //     return (
    //       <JSONStringify key={ i } data={ t } />
    //     )
    //   }
    // }
    // else {
    //   return (
    //     <JSONStringify key={ i } data={ t } />
    //   )
    // }

    return <></>

    function InlineText() {
      const href = t.href
      const { text } = (t as TextRichTextItemResponse)
      return (
        href
          ? (
            <a className={ annotationCN } href={ href }>
              { text.content }
            </a>
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
                  <CalendarInlineIcon className="inline text-zinc-600 mr-1 leading mb-1" />
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
          break
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

