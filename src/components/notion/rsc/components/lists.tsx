import { cn } from "@/components/typography"
import { NotionComponentProp } from "../notion-ast-renderer"

export function TodoList({
  children,
  className
}: NotionComponentProp<'to_do'>) {

  return (
    <ul className={className}>
      {children}
    </ul>
  )

}
export function BulletedList({
  children,
  className
}: NotionComponentProp<'bulleted_list_item'>) {

  return (
    <ul className={className}>
      {children}
    </ul>
  )

}
export function NumberedList({
  children,
  className
}: NotionComponentProp<'numbered_list_item'>) {

  return (
    <ol className={className}>
      {children}
    </ol>
  )

}