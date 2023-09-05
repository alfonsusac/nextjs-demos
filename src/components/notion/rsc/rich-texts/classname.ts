import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

type Annotation = RichTextItemResponse['annotations']

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
        'font-mono text-[0.8750em] p-1 -mx-1 bg-zinc-800 rounded-md ' : '',
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