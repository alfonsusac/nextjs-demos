import { AudioBlockObjectResponse, BlockObjectResponse, BookmarkBlockObjectResponse, BreadcrumbBlockObjectResponse, BulletedListItemBlockObjectResponse, CalloutBlockObjectResponse,  ChildDatabaseBlockObjectResponse, ChildPageBlockObjectResponse, CodeBlockObjectResponse, ColumnBlockObjectResponse, ColumnListBlockObjectResponse, DividerBlockObjectResponse, EmbedBlockObjectResponse, EquationBlockObjectResponse, FileBlockObjectResponse, Heading1BlockObjectResponse, Heading2BlockObjectResponse, Heading3BlockObjectResponse, ImageBlockObjectResponse, LinkPreviewBlockObjectResponse, LinkToPageBlockObjectResponse, ListBlockChildrenResponse, NumberedListItemBlockObjectResponse, ParagraphBlockObjectResponse, PdfBlockObjectResponse, QuoteBlockObjectResponse, RichTextItemResponse, SyncedBlockBlockObjectResponse, TableBlockObjectResponse, TableOfContentsBlockObjectResponse, TableRowBlockObjectResponse, TemplateBlockObjectResponse, ToDoBlockObjectResponse, ToggleBlockObjectResponse, UnsupportedBlockObjectResponse, VideoBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { notion } from "./data"



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
    // console.info("Visiting " + currentNode.type)

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

  return { ast: root, unknowns: jsxOfUnknownType }
}


type Props =
  | BulletedListItemBlockObjectResponse['bulleted_list_item']
  | NumberedListItemBlockObjectResponse['numbered_list_item']



export class NotionASTNode {

  type: BlockObjectResponse['type']
    | 'root'
    | 'list_item'
    = 'root'
  id: string = ''
  has_children?: true
  is_group?: true
  content?: RichTextItemResponse[]
  props: {
    [key: string]: any
  } = {}
  children: NotionASTNode[] = []


  constructor(
    public parent?: NotionASTNode,
    block?: BlockObjectResponse,
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
      info: `${this.type} | ${this.has_children ? "hasChildren" : "noChildren"} | ${this.id}`,
      type: `${this.type} | parent:${this.parent?.type}`,
      content: this.content?.map(c => c.plain_text).join(''),
      props: this.props,
      children: this.children,
    }
  }
}

type OmitRichText<T> = Omit<T, 'rich_text'>

export type NodeTypes = {
  'root': NotionASTNode & {
    type: 'root'
    props: {}
  }

  'list_item': NotionASTNode & {
    type: 'list_item'
    props:
    & OmitRichText<BulletedListItemBlockObjectResponse['bulleted_list_item']>
    & OmitRichText<NumberedListItemBlockObjectResponse['numbered_list_item']>
    & OmitRichText<ToDoBlockObjectResponse['to_do']>
  }
  'bulleted_list_item': NotionASTNode & {
    type: 'bulleted_list_item'
    props: {}
  }
  'numbered_list_item': NotionASTNode & {
    type: 'numbered_list_item'
    props: {}
  }
  'to_do': NotionASTNode & {
    type: 'to_do'
    props: {}
  }
  'heading_1': NotionASTNode & {
    type: 'heading_1'
    props: OmitRichText<Heading1BlockObjectResponse['heading_1']>
  }
  'heading_2': NotionASTNode & {
    type: 'heading_2'
    props: OmitRichText<Heading2BlockObjectResponse['heading_2']>
  }
  'heading_3': NotionASTNode & {
    type: 'heading_3'
    props: OmitRichText<Heading3BlockObjectResponse['heading_3']>
  }
  'paragraph': NotionASTNode & {
    type: 'paragraph'
    props: OmitRichText<ParagraphBlockObjectResponse['paragraph']>
  }
  'code': NotionASTNode & {
    type: 'code'
    props: OmitRichText<CodeBlockObjectResponse['code']>
  }
  'toggle': NotionASTNode & {
    type: 'toggle'
    props: OmitRichText<ToggleBlockObjectResponse['toggle']>
  }
  'quote': NotionASTNode & {
    type: 'quote'
    props: OmitRichText<QuoteBlockObjectResponse['quote']>
  }
  'divider': NotionASTNode & {
    type: 'divider'
    props: OmitRichText<DividerBlockObjectResponse['divider']>
  }

  'equation': NotionASTNode & {
    type: 'equation'
    props: OmitRichText<EquationBlockObjectResponse['equation']>
  }
  'callout': NotionASTNode & {
    type: 'callout'
    props: OmitRichText<CalloutBlockObjectResponse['callout']>
  }
  'column_list': NotionASTNode & {
    type: 'column_list'
    props: OmitRichText<ColumnListBlockObjectResponse['column_list']>
  }
  'column': NotionASTNode & {
    type: 'column'
    props: OmitRichText<ColumnBlockObjectResponse['column']>
  }
  'table': NotionASTNode & {
    type: 'table'
    props: OmitRichText<TableBlockObjectResponse['table']>
  }
  'table_row': NotionASTNode & {
    type: 'table_row'
    props: OmitRichText<TableRowBlockObjectResponse['table_row']>
  }
  'bookmark': NotionASTNode & {
    type: 'bookmark'
    props: OmitRichText<BookmarkBlockObjectResponse['bookmark']>
  }

  'image': NotionASTNode & {
    type: 'image'
    props: OmitRichText<ImageBlockObjectResponse['image']>
  }
  'video': NotionASTNode & {
    type: 'video'
    props: OmitRichText<VideoBlockObjectResponse['video']>
  }
  'pdf': NotionASTNode & {
    type: 'pdf'
    props: OmitRichText<PdfBlockObjectResponse['pdf']>
  }
  'audio': NotionASTNode & {
    type: 'audio'
    props: OmitRichText<AudioBlockObjectResponse['audio']>
  }

  'file': NotionASTNode & {
    type: 'file'
    props: OmitRichText<FileBlockObjectResponse['file']>
  }
  'embed': NotionASTNode & {
    type: 'embed'
    props: OmitRichText<EmbedBlockObjectResponse['embed']>
  }
  'link_preview': NotionASTNode & {
    type: 'link_preview'
    props: OmitRichText<LinkPreviewBlockObjectResponse['link_preview']>
  }


  'synced_block': NotionASTNode & {
    type: 'synced_block'
    props: OmitRichText<SyncedBlockBlockObjectResponse['synced_block']>
  }
  'child_page': NotionASTNode & {
    type: 'child_page'
    props: OmitRichText<ChildPageBlockObjectResponse['child_page']>
  }
  'child_database': NotionASTNode & {
    type: 'child_database'
    props: OmitRichText<ChildDatabaseBlockObjectResponse['child_database']>
  }
  'breadcrumb': NotionASTNode & {
    type: 'breadcrumb'
    props: OmitRichText<BreadcrumbBlockObjectResponse['breadcrumb']>
  }
  'table_of_contents': NotionASTNode & {
    type: 'table_of_contents'
    props: OmitRichText<TableOfContentsBlockObjectResponse['table_of_contents']>
  }
  'link_to_page': NotionASTNode & {
    type: 'link_to_page'
    props: OmitRichText<LinkToPageBlockObjectResponse['link_to_page']>
  }
  'template': NotionASTNode & {
    type: 'template'
    props: OmitRichText<TemplateBlockObjectResponse['template']>
  }
  'unsupported': NotionASTNode & {
    type: 'unsupported'
    props: OmitRichText<UnsupportedBlockObjectResponse['unsupported']>
  }

}

export type RootNode = NotionASTNode & {
  type: 'root'
  props: {}
}

export type ListItemNode = NotionASTNode & {
  type: 'list_item'
  props:
  & OmitRichText<BulletedListItemBlockObjectResponse['bulleted_list_item']>
  & OmitRichText<NumberedListItemBlockObjectResponse['numbered_list_item']>
  & OmitRichText<ToDoBlockObjectResponse['to_do']>
}
export type BulletedListNode = NotionASTNode & {
  type: 'bulleted_list_item'
  props: {}
}
export type NumberedListNode = NotionASTNode & {
  type: 'numbered_list_item'
  props: {}
}
export type ToDoListNode = NotionASTNode & {
  type: 'to_do'
  props: {}
}
export type Heading1Node = NotionASTNode & {
  type: 'heading_1'
  props: OmitRichText<Heading1BlockObjectResponse['heading_1']>
}
export type Heading2Node = NotionASTNode & {
  type: 'heading_2'
  props: OmitRichText<Heading2BlockObjectResponse['heading_2']>
}
export type Heading3Node = NotionASTNode & {
  type: 'heading_3'
  props: OmitRichText<Heading3BlockObjectResponse['heading_3']>
}
export type ParagraphNode = NotionASTNode & {
  type: 'paragraph'
  props: OmitRichText<ParagraphBlockObjectResponse['paragraph']>
}
export type CodeNode = NotionASTNode & {
  type: 'code'
  props: OmitRichText<CodeBlockObjectResponse['code']>
}
export type ToggleNode = NotionASTNode & {
  type: 'toggle'
  props: OmitRichText<ToggleBlockObjectResponse['toggle']>
}
export type QuoteNode = NotionASTNode & {
  type: 'quote'
  props: OmitRichText<QuoteBlockObjectResponse['quote']>
}
export type DividerNode = NotionASTNode & {
  type: 'divider'
  props: OmitRichText<DividerBlockObjectResponse['divider']>
}

export type EquationNode = NotionASTNode & {
  type: 'equation'
  props: OmitRichText<EquationBlockObjectResponse['equation']>
}
export type CalloutNode = NotionASTNode & {
  type: 'callout'
  props: OmitRichText<CalloutBlockObjectResponse['callout']>
}
export type ColumnListNode = NotionASTNode & {
  type: 'column_list'
  props: OmitRichText<ColumnListBlockObjectResponse['column_list']>
}
export type ColumnNode = NotionASTNode & {
  type: 'column'
  props: OmitRichText<ColumnBlockObjectResponse['column']>
}
export type TableNode = NotionASTNode & {
  type: 'table'
  props: OmitRichText<TableBlockObjectResponse['table']>
}
export type TableRowNode = NotionASTNode & {
  type: 'table_row'
  props: OmitRichText<TableRowBlockObjectResponse['table_row']>
}
export type BookmarkNode = NotionASTNode & {
  type: 'bookmark'
  props: OmitRichText<BookmarkBlockObjectResponse['bookmark']>
}

export type ImageNode = NotionASTNode & {
  type: 'image'
  props: OmitRichText<ImageBlockObjectResponse['image']>
}
export type VideoNode = NotionASTNode & {
  type: 'video'
  props: OmitRichText<VideoBlockObjectResponse['video']>
}
export type PdfNode = NotionASTNode & {
  type: 'pdf'
  props: OmitRichText<PdfBlockObjectResponse['pdf']>
}
export type AudioNode = NotionASTNode & {
  type: 'audio'
  props: OmitRichText<AudioBlockObjectResponse['audio']>
}

export type FileNode = NotionASTNode & {
  type: 'file'
  props: OmitRichText<FileBlockObjectResponse['file']>
}
export type EmbedNode = NotionASTNode & {
  type: 'embed'
  props: OmitRichText<EmbedBlockObjectResponse['embed']>
}
export type LinkPreviewNode = NotionASTNode & {
  type: 'link_preview'
  props: OmitRichText<LinkPreviewBlockObjectResponse['link_preview']>
}


export type SyncedBlockNode = NotionASTNode & {
  type: 'synced_block'
  props: OmitRichText<SyncedBlockBlockObjectResponse['synced_block']>
}
export type ChildPageNode = NotionASTNode & {
  type: 'child_page'
  props: OmitRichText<ChildPageBlockObjectResponse['child_page']>
}
export type ChildDatabaseNode = NotionASTNode & {
  type: 'child_database'
  props: OmitRichText<ChildDatabaseBlockObjectResponse['child_database']>
}
export type BreadCrumbNode = NotionASTNode & {
  type: 'breadcrumb'
  props: OmitRichText<BreadcrumbBlockObjectResponse['breadcrumb']>
}
export type TableOfContentsNode = NotionASTNode & {
  type: 'table_of_contents'
  props: OmitRichText<TableOfContentsBlockObjectResponse['table_of_contents']>
}
export type LinkToPageNode = NotionASTNode & {
  type: 'link_to_page'
  props: OmitRichText<LinkToPageBlockObjectResponse['link_to_page']>
}
export type TemplateNode = NotionASTNode & {
  type: 'template'
  props: OmitRichText<TemplateBlockObjectResponse['template']>
}
export type UnsupportedNode = NotionASTNode & {
  type: 'unsupported'
  props: OmitRichText<UnsupportedBlockObjectResponse['unsupported']>
}
