import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints"
import { NotionASTNode } from "../parser/node"
import { NodeTypes } from "../types"
import { convertChildrenToAST } from "../parser/parser"


/** ----------------------------------------------------------
 * Entry Point
 * 
 * 
 */

type NotionASTComponentMap = {
  [key in NotionASTNode['type']]:
  (
    param: React.DetailedHTMLProps<React.HTMLAttributes<any>, any> &
    { node: NodeTypes[key] }
  ) => React.ReactNode
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
      <Component key={ index } node={ childn as never }>
        { childn.children &&
          <NotionASTRendererRecursor node={ childn } componentMap={ components } />
        }
      </Component>
    )
  })
}
