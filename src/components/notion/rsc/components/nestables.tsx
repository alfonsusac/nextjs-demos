import { cn } from "@/components/typography"
import { Toggle } from "../../client"
import { NotionComponentProp } from "../notion-ast-renderer-2"
import { NotionIcon } from "../images"
import { RichTextNode } from "./common"


export function Paragraph({
  children,
  node,
  className
}: NotionComponentProp<'paragraph'>) {

  return (
    <div className={ cn(className, "m-0 my-2") }>
      <p>
        <RichTextNode node={ node } />
      </p>
      <div className="pl-4">
        { children }
      </div>
    </div>
  )

}


export function ToggleBlock({
  children,
  node,
  className
}: NotionComponentProp<'toggle'>) {
  return (
    <Toggle
      headerSlot={ <RichTextNode node={ node } /> }
      className={ className }
    >
      <div className="pl-4">
        { children }
      </div>
    </Toggle>
  )
}


export function QuoteBlock({
  children,
  node,
  className
}: NotionComponentProp<'quote'>) {
  return (
    <blockquote className={ className }>
      <RichTextNode node={ node } />
      { children }
    </blockquote>
  )
}


export function CalloutBlock({
  children,
  className,
  node
}: NotionComponentProp<'callout'>) {
  return (
    <div className={ cn(
      className,
      "flex gap-3",
      "p-4 my-2",
      "rounded-md border-zinc-800",
      "bg-zinc-900"
    ) }>
      <NotionIcon icon={ node.props.icon } />
      <div>
        <RichTextNode node={ node } />
        { children }
      </div>
    </div>
  )
}



