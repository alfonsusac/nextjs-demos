import { H2, H3, H4 } from "@/components/typography"
import { Toggle } from "../../client"
import { NotionComponentProp } from "../notion-ast-renderer-2"

export function HeadingBuilder(level: 1 | 2 | 3) {

  return function NotionHeading({
    node, Children, children, richText
  }: NotionComponentProp<'heading_1' | 'heading_2' | 'heading_3'>) {

    const InnerHeading = level === 1 ? (
      <H2>
        { richText }
      </H2>
    ) : level === 2 ? (
      <H3>
        { richText }
      </H3>
    ) : level === 3 ? (
      <H4>
        { richText }
      </H4>
    ) : <></>

    return node.props.is_toggleable ? (

      <Toggle className="toggle-heading1"
        headerSlot={ InnerHeading }>
        <div className="pl-4">
          { children }
        </div>
      </Toggle>

    ) : (

      InnerHeading

    )

  }


}