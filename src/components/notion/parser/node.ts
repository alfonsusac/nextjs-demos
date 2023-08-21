import { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { MapToAST } from "./parser"




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
      if (prop === 'rich_text')
        this.content = props.rich_text
      else
        this.props[prop] = props[prop]
    }

  }

  pushChild(child: NotionASTNode) {
    this.children.push(child)
    child.parent = this
  }

  toJSON() {
    return {
      info: `${this.type} | ${this.has_children ? "hasChildren" : "noChildren"} | ${this.id}`,
      type: `${this.type} | parent:${this.parent?.type}`,
      content: this.content?.map(c => c.plain_text).join(''),
      props: this.props,
      children: this.children,
    }
  }
}




