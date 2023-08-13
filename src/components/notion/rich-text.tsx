import { EquationRichTextItemResponse, RichTextItemResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

export function Text(p: {
  rich_text: TextRichTextItemResponse
  cn: string
}) {
  const rt = p.rich_text
  const { bold, italic, strikethrough, underline, code, color } = rt.annotations
  const isUnformatted = !bold && !italic && !strikethrough && !underline && !code && color === 'default'

  return (
    rt.href
      ? (
        <a className={ p.cn } href={ rt.href }>
          { rt.text.content }
        </a>
      ) : isUnformatted
      ? (<>{ rt.text.content }</>)
        : (<span className={ p.cn }>{ rt.text.content }</span>)
  )
}

export function InlineEquation(p: {
  rich_text: EquationRichTextItemResponse
}) {

}


function annToCn(annotation: Annotation, className?: string) {
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


type Annotation = RichTextItemResponse['annotations']