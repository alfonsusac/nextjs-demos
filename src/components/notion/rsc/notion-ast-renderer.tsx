import { NotionASTJSXMap } from "@/app/articles/[slug]/page"
import { NodeTypes, NotionASTNode } from "../response-to-ast"

type NotionASTComponentMap = {
  [key in NotionASTNode['type']]:
  (
    param: React.DetailedHTMLProps<React.HTMLAttributes<any>, any> &
    { node: NodeTypes[key] }
  ) => React.ReactNode
}

export default function NotionASTRenderer(p: {
  node: NotionASTNode,
  components: Partial<NotionASTComponentMap>
}) {
  
  for (const i in NotionASTDefaultComponentMap) {
    if(i in p.components === false){
      p.components[i as types] = NotionASTDefaultComponentMap[i as types] as any
    }
  }

  return p.node.children.map((e, i) => {
    const Component = p.components[e.type] ?? 'div'

    return (
      <Component key={ i } node={ e as never }>
        {
          e.children ? (
            <NotionASTRenderer
              node={ e }
              components={ p.components }
            />
          ) : null
        }
      </Component>
    )
  })
}

const NotionASTDefaultComponentMap: NotionASTComponentMap = NotionASTJSXMap
type types = keyof NotionASTComponentMap