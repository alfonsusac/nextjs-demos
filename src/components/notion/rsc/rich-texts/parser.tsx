import { EquationRichTextItemResponse, MentionRichTextItemResponse, RichTextItemResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"
import { KaTeXRSC } from "../../../katex/rsc"
import { getMetaInfo } from "../../../metadata/util"
import { AtInlineSymbol, CalendarInlineIcon, DatabasePageIcon, MaterialSymbolsPerson, PhGlobe, PhNotionLogoFill } from "../../../svg"
import { formatRelative } from "date-fns"
import { InlineMentionTooltip } from "../../client"
import { cn } from "@/components/typography"
import { convertColorToClassname } from "./classname"
import { parseNotionHref } from "./href"
import { Suspense } from "react"
import LoadingLine from "./loading"

export async function NotionRichText(p: {
  rich_text: RichTextItemResponse[]
}) {

  return p.rich_text.map((t, i) => {

    const prev = i > 0 ? p.rich_text.at(i - 1) : undefined
    const curr = p.rich_text[i]
    const next = p.rich_text.at(i + 1)

    const annotationCN = twMerge(
      clsx(
        'm-0 p-0',
        curr.annotations.bold ?
          'font-semibold text-white' : '',
        curr.annotations.italic ?
          'italic' : '',
        curr.annotations.strikethrough ?
          'line-through' : '',
        curr.annotations.underline ?
          'underline' : '',
        curr.annotations.code ?
          cn(
            'font-mono text-[0.8750em] py-1 bg-slate-800',
            prev?.annotations.code ? '' : 'pl-1 rounded-l-md',
            next?.annotations.code ? '' : 'pr-1 rounded-r-md',
          ) : '',
        convertColorToClassname(curr.annotations.color),
      )
    )

    const { bold, italic, strikethrough, underline, code, color } = t.annotations
    const isUnformatted =
      !bold
      && !italic
      && !strikethrough
      && !underline
      && !code
      && color === 'default'

    const InlineText = async () => {
      const { text } = (t as TextRichTextItemResponse)
      const content = text.content.split('\n').map((c, i) => i ? [<br key={ i } />, c] : c)

      if (!t.href) return isUnformatted
        ? <>{ content }</>
        : <span className={ annotationCN }>{ content }</span>

      const href = await parseNotionHref(t.href)

      return (
        <InlineMentionTooltip content={
          <>
            <PhGlobe className="inline text-slate-600 mr-1 leading mb-1" />
            { href }
          </>
        }>
          <a className={ annotationCN }
            href={ href }
            target={ href.startsWith('#') ? undefined : '_blank' }
          >
            { content }
          </a>
        </InlineMentionTooltip>
      )
    }

    switch (t.type) {
      case 'text':
        return (
          <Suspense fallback={ <LoadingLine text="Loading" />}>
            <InlineText key={ i } />
          </Suspense>
        )
      case 'equation':
        return <InlineEquation key={ i } />
      case 'mention':
        return <InlineMention key={ i } />
      default:
        return <></>
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
              target="_blank"
              href={ t.href! }
              className={
                clsx(annotationCN, inlinePaddingCN, inlineHoverCN, '')
              }
            >
              <span className="h-full inline-block text-slate-600 text-sm pr-0.5">
                <DatabasePageIcon className="inline text-lg text-slate-600 mb-1" />
              </span>
              <span className="decoration-slate-600 text-slate-300 underline">
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
                <CalendarInlineIcon className="inline text-slate-600 mr-1 leading mb-1" />
                {
                  mention.date.start + (endDate ? ` → ${mention.date.end}` : '')
                }
              </>
            }>
              <span className={ clsx(annotationCN, inlinePaddingCN, inlineHoverCN, 'hover:tex-slate-300') }>
                <span className="h-full inline text-slate-600 text-sm pr-0.5">
                  <AtInlineSymbol className="inline text-lg mb-1" />
                </span>
                <span className="decoration-slate-600 text-slate-400">
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
            <a
              className={ clsx(annotationCN, inlinePaddingCN, inlineHoverCN) }
              href={ t.href! }
              target="_blank"
            >
              <span className="h-full inline-block text-slate-300 text-sm pr-0.5">
                {// eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={ metadata.url ? (new URL(metadata.url)).hostname : 'Link preview' }
                    className="inline text-lg mb-1 w-4 h-4 rounded-sm"
                    src={ metadata.faviconpath }
                  /> }
              </span>
              <span className="decoration-slate-600 text-slate-400">
                { metadata.title }
              </span>
            </a>
          )


        case 'page':
          return (
            <a
              className={ clsx(annotationCN, inlinePaddingCN, inlineHoverCN) }
              href={ t.href! }
              target="_blank"
            >
              <span className="h-full inline-block text-slate-300 text-sm pr-0.5">
                <PhNotionLogoFill className="inline text-lg mb-1" />
              </span>
              <span className="decoration-slate-600 text-slate-400">
                { t.plain_text }
              </span>
            </a>
          )


        case 'user':

          if ('type' in mention.user) {
            return (
              <InlineMentionTooltip content={
                <>
                  <MaterialSymbolsPerson className="inline text-slate-600 mr-1 leading mb-1" />
                  Person
                </>
              }>
                <span className={ clsx(annotationCN, inlinePaddingCN, inlineHoverCN, 'hover:tex-slate-300') }>
                  <span className="h-full inline text-slate-600 text-sm pr-0.5">
                    <AtInlineSymbol className="inline text-lg mb-1" />
                  </span>
                  <span className="decoration-slate-600 text-slate-400">
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



