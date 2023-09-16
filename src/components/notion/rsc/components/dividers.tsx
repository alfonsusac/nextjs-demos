import { cn } from "@/components/typography"
import { NotionComponentProp } from "../notion-ast-renderer"

export function DividerBlock() {

  return <hr/>

}




export function ColumnListBlock({
  children,
  className,
}: NotionComponentProp<'column_list'>) {

  return (
    <div className={ cn(className,
      "grid grid-flow-col auto-cols-fr gap-x-4"
    ) }>
      { children }
    </div>
  )

}




export function ColumnBlock({
  children,
  className,
}: NotionComponentProp<'column'>) {

  return (
    <div className={ cn(className,
      "w-full my-2"
    ) }>
      { children }
    </div>
  )

}

