import { cn } from "@/components/typography"
import { NotionComponentProp } from "../notion-ast-renderer-2"
import { CheckboxSVG } from "@/components/svg"
import { RichTextNode } from "./common"

export function ListItem({
  children,
  className,
  node,
}: NotionComponentProp<'list_item'>) {

  if ('checked' in node.props) {
    const checked = node.props.checked
    return (
      <li className={ cn(
        className,
        checked ? 'checked' : '',
        'list-none relative'
      ) }>
        <CheckboxSVG
          checked={ checked }
          className="absolute -left-8 w-8 h-6 my-auto mb-1" />
        <RichTextNode node={ node } />
        { children }
      </li>
    )

  } else {

    return (
      <li>
        <RichTextNode node={ node } />
        { children }
      </li>
    )

  }
}