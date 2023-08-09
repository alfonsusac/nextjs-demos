import { BlockObjectResponse, ListBlockChildrenResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { Block } from "notion-types"
import { notion } from "./notion"



type UnknownJSONList = any[]
type OnMapToASTCallback = (node: NotionASTNode) => void
type OnMapToASTCallbackMap = { [key in BlockType]: OnMapToASTCallback }
type BlockType = BlockObjectResponse['type']

export async function convertChildrenToAST(
  data: ListBlockChildrenResponse,
  options?: {
    createSectionAtEveryHeading?: true,
    fetchChildrenCallback?: (id: string) => ListBlockChildrenResponse,
    mapperASTs?: OnMapToASTCallbackMap
  }
) {

  const root = new NotionASTNode()
  const jsxOfUnknownType: UnknownJSONList = []

  await mapBlockListToAST(data.results, root)

  
  async function mapBlockListToAST(list: ListBlockChildrenResponse['results'], currentNode: NotionASTNode) {
    console.info("Visiting " + currentNode.type)
    
    const fetchChildQueue: { id: string, node: NotionASTNode }[] = []
    
    await Promise.all(list.map(unknownblock => {
      return (async () => {
        if (!Object.hasOwn(unknownblock, 'type') || unknownblock.object !== 'block') {
          jsxOfUnknownType.push(unknownblock)
          return
        }
        const block = unknownblock as BlockObjectResponse

        let onMapToAST: OnMapToASTCallback = (newNode) => {
          currentNode.children.push(newNode)
        } // default

        // Apply Default Rules to Lists
        const blockThatNeedsGroupingArr: BlockType[] = [
          'bulleted_list_item',
          'numbered_list_item',
          'to_do'
        ]
        if (blockThatNeedsGroupingArr.includes(block.type)) onMapToAST = (newNode) => {
          const lastChildNode = currentNode.children.at(-1)
          newNode.type = 'list_item'
          if (lastChildNode?.type === block.type) {
            newNode.parent = lastChildNode
            lastChildNode.children.push(newNode)
          } else {
            const newListGroupNode = new NotionASTNode(currentNode)
            newNode.parent = newListGroupNode
            newListGroupNode.type = block.type
            newListGroupNode.is_group = true
            newListGroupNode.children.push(newNode)
            currentNode.children.push(newListGroupNode)
          }
        }

        // Apply Custom Rules (Untested)
        if (options?.mapperASTs && Object.hasOwn(options.mapperASTs, block.type)) {
          onMapToAST = options.mapperASTs[block.type]
        }

        const newNode = new NotionASTNode(currentNode, block, onMapToAST)

        if (block.has_children === true) {
          const children = await notion.blocks.children.list({
            block_id: block.id,
            page_size: 1000
          })
          await mapBlockListToAST(children.results, newNode)
        }
      })()
    }))
  }

  return { ast: root, unknowns: jsxOfUnknownType}
}




export class NotionASTNode {

  type: BlockObjectResponse['type']
    | 'root'
    | 'list_item'
    = 'root'
  id: string = ''
  has_children?: true
  is_group?: true
  content?: RichTextItemResponse[]
  props: { [key: string]: any } = {}
  children: NotionASTNode[] = []


  constructor(
    public parent?: NotionASTNode,
    private readonly block?: BlockObjectResponse,
    onCreate?: (node: NotionASTNode) => void,
  ) {

    // If Node is not a root of collection (has source of info)
    if (block !== undefined) {
      this.type = block.type
      const props = (block as any)[block.type]
      for (const prop in props) {
        // If any, Add rich_text to the content 
        if (prop === 'rich_text') { this.content = props[prop] }
        // Add the rest of the properties to `props`
        else this.props[prop] = props[prop]
      }
      if (block.has_children) {
        this.has_children = true
      }
      this.id = block.id
    }

    onCreate && onCreate(this)
  }

  toJSON() {
    return {
      type: this.type,
      parent: this.parent?.type,
      has_children: this.has_children,
      content: this.content?.map( c => c.plain_text ).join(''),
      children: this.children,
    }
  }
}