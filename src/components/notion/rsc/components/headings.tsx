import { H2, H3, H4, cn } from "@/components/typography"
import { Toggle } from "../../client"
import { NotionComponentProp } from "../notion-ast-renderer-2"
import { RichTextNode } from "./common"
import { slug } from "github-slugger"
import { flattenRichText } from "../rich-texts/utils"

export function HeadingBuilder(level: 1 | 2 | 3) {

  return function NotionHeading({
    node,
    children,
    className
  }: NotionComponentProp<'heading_1' | 'heading_2' | 'heading_3'>) {

    const slugid = slug(flattenRichText(node.props.rich_text))

    return node.props.is_toggleable ? (

      <Toggle className="toggle-heading1"
        headerSlot={

          level === 1 ? (
            <H2 className={ cn(className, 'my-0') } id={ slugid }>
              <RichTextNode node={ node } />
            </H2>
          ) : level === 2 ? (
            <H3 className={ cn(className, 'my-0') } id={ slugid }>
              <RichTextNode node={ node } />
            </H3>
          ) : level === 3 ? (
            <H4 className={ cn(className, 'my-0') } id={ slugid }>
              <RichTextNode node={ node } />
            </H4>
          ) : <></>

        }>
        <div className="pl-4">
          { children }
        </div>
      </Toggle>

    ) : (

      level === 1 ? (
        <H2 className={ cn(className) } id={ slugid }>
          <RichTextNode node={ node } />
        </H2>
      ) : level === 2 ? (
        <H3 className={ cn(className) } id={ slugid }>
          <RichTextNode node={ node } />
        </H3>
      ) : level === 3 ? (
        <H4 className={ cn(className) } id={ slugid }>
          <RichTextNode node={ node } />
        </H4>
      ) : <></>

    )

  }

}