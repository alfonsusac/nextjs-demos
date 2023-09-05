import { NotionASTNode } from "../parser/node"
import { NodeTypes } from "../types"
import { H2 } from "@/components/typography"
import { Toggle } from "../client"
import { NotionRichText } from "./rich-texts/parser"
import { BulletedList, NumberedList, TodoList } from "./components/lists"
import { ListItem } from "./components/list-items"
import { HeadingBuilder } from "./components/headings"
import { CalloutBlock, Paragraph, QuoteBlock, ToggleBlock } from "./components/nestables"
import { ColumnBlock, ColumnListBlock, DividerBlock } from "./components/dividers"
import { TableBlock, TableRow } from "./components/tables"
import { LinkBookmark } from "./components/link-previews"
import { AudioBlock, EmbedBlock, FileBlock, ImageBlock, PDFBlock, VideoBlock } from "./components/embeds"
import { CodeBlock, EquationBlock } from "./components/exotic-texts"
import { Audit } from "@/components/timer"


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
  caption?: React.ReactNode,
  node: NodeTypes[T],
  Children?: NestedChildrenProp,
  className?: string,
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

export function NotionASTRenderer({ ast, ...rest }: {
  ast: NotionASTNode,
  components?: NotionASTComponentMap
}) {

  // console.log("> Notion AST Renderer")

  const defaultComponents: NotionASTComponentMap = {

    // ※ Headings
    'heading_1': HeadingBuilder(1),
    'heading_2': HeadingBuilder(2),
    'heading_3': HeadingBuilder(3),

    // ※ Lists
    'to_do': TodoList,
    'bulleted_list_item': BulletedList,
    'numbered_list_item': NumberedList,
    'list_item': ListItem,

    // ※ Nestables
    'paragraph': Paragraph,
    'toggle': ToggleBlock,
    'quote': QuoteBlock,
    'callout': CalloutBlock,

    // ※ Exotic Texts
    'equation': EquationBlock,
    'code': CodeBlock,

    // ※ Dividers
    'divider': DividerBlock,
    'column_list': ColumnListBlock,
    'column': ColumnBlock,

    // ※ Tables
    'table': TableBlock,
    'table_row': TableRow,

    // ※ Embeds
    // 'bookmark': () => <></>, // async
    'bookmark': LinkBookmark, // async
    'video': VideoBlock,
    // 'image': () => <></>, // async
    'image': ImageBlock, // async
    'pdf': PDFBlock, 
    'audio': AudioBlock, 
    'file': FileBlock, // async
    'embed': EmbedBlock, // async

    // ※ Not Implemented
    'template': () => <></>,
    'synced_block': () => <></>,
    'child_page': () => <></>,
    'child_database': () => <></>,
    'breadcrumb': () => <></>,
    'table_of_contents': () => <></>,
    'link_to_page': () => <></>,
    'link_preview': () => <></>,
    'unsupported': () => <></>,
    'root': () => <></>,

  }

  const audit = new Audit('', false)

  const RenderResult = <NotionASTRendererRecursor node={ ast } componentMap={ defaultComponents } />

  audit.mark('Render Content')

  return RenderResult
}

/**
 * 
 * ----------------------------------------------------------
 */

function NotionASTRendererRecursor({ node, componentMap }: {
  node: NotionASTNode,
  componentMap: NotionASTComponentMap
}) {

  return node.children.map((childnode, index) => {

    const Component = componentMap[childnode.type]
    if(!Component) return <></>

    return (
      <Component
        key={ index }
        node={ childnode as never }

      >
        { childnode.children &&
          <NotionASTRendererRecursor node={ childnode } componentMap={ componentMap } />
        }
      </Component>
    )
  })

}
