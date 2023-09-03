import { NotionASTNode } from "../parser/node"
import { NodeTypes } from "../types"
import { H2 } from "@/components/typography"
import { Toggle } from "../client"
import { NotionRichText } from "./rich-text"
import { Heading1, HeadingBuilder } from "./components/headings"


/** ----------------------------------------------------------
 * Entry Point
 * 
 * 
 */
type RichTextProp = () => JSX.Element
type NestedChildrenProp = (param: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => JSX.Element

export type NotionComponentProp<T extends NotionASTNode['type']> = {
  children?: React.ReactNode,
  richText?: React.ReactNode,
  node: NodeTypes[T],
  Children?: NestedChildrenProp,
}

type NotionASTComponentMap = {
  [key in NotionASTNode['type']]:( param: NotionComponentProp<key> ) => React.ReactNode
}

export type InputComponents = (
  comps: {
    RichText: React.ReactNode
    Caption: React.ReactNode
    flattenedRichText?: string
    flattenedCaption?: string
    node: NotionASTNode
  }
) => Partial<NotionASTComponentMap>

export async function NotionASTRenderer({ ast, ...rest }: {
  ast: NotionASTNode,
  components?: InputComponents
}) {

  const defaultComponents: NotionASTComponentMap = {

    /**
     *   ※ Heading 1
     */
    heading_1: HeadingBuilder(1),
    heading_2: HeadingBuilder(2),
    heading_3: HeadingBuilder(3),
    


  }



  const components: NotionASTComponentMap = {

  }

  return <NotionASTRendererRecursor node={ ast } componentMap={ components } />
}

/**
 * 
 * ----------------------------------------------------------
 */

function NotionASTRendererRecursor({ node, componentMap }: {
  node: NotionASTNode,
  componentMap: NotionASTComponentMap
}) {
  return node.children.map((childn, index) => {

    const Component = componentMap[node.type]
    return (
      <Component
        key={ index }
        node={ childn as never }
      >
        { childn.children &&
          <NotionASTRendererRecursor node={ childn } componentMap={ components } />
        }
      </Component>
    )
  })
}
