import { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { flattenRichText } from "../rsc/rich-texts/utils"


export type NotionASTNodeType = NotionASTNode['toJSON']
/**
 * Responsible to convert Notion "Blocks" to Notion AST Node
 */
export class NotionASTNode {
  
  id: string = ''
  type: BlockObjectResponse['type'] | 'root' | 'list_item' = 'root'
  has_children?: true
  is_group?: true
  content?: RichTextItemResponse[]
  props: { [key: string]: any } = {}
  raw_content?: string

  // Tree
  children: NotionASTNode[] = []
  parent?: NotionASTNode


  constructor(
    block?: BlockObjectResponse,
  ) {
    // Root Node is when block is undefined.
    if (block === undefined) return

    this.type = block.type
    this.has_children = block.has_children ? true : undefined
    this.id = block.id

    const props = (block as any)[block.type]
    for (const prop in props) {
      if (prop === 'rich_text') {
        this.content = props.rich_text
        this.raw_content = flattenRichText(props.rich_text)
      }
      this.props[prop] = props[prop]
    }

  }

  pushChild(child: NotionASTNode) {
    this.children.push(child)
    child.parent = this
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      has_children: this.has_children,
      is_group: this.is_group,
      content: this.content,
      props: this.props,
      raw_content: this.raw_content,
      children: this.children,

      // Meta
      meta: {
        summary: `${this.type} | ${this.has_children ? "hasChildren" : "noChildren"} | ${this.id}`,
        type: `${this.type} | parent:${this.parent?.type}`,
      }
    }
  }
}




export function visitNotionAST(node: NotionASTNode, cb: (node:NotionASTNode)=>void) {
  cb(node)
  
  if (node.children) {
    node.children.forEach(child => visitNotionAST(child, cb))
  }
}