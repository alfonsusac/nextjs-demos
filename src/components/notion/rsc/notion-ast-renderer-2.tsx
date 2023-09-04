import { NotionASTNode } from "../parser/node"
import { NodeTypes } from "../types"
import { H2 } from "@/components/typography"
import { Toggle } from "../client"
import { NotionRichText } from "./rich-text"
import { BulletedList, NumberedList, TodoList } from "./components/lists"
import { ListItem } from "./components/list-items"
import { HeadingBuilder } from "./components/headings"
import { CalloutBlock, Paragraph, QuoteBlock, ToggleBlock } from "./components/nestables"
import { ColumnBlock, ColumnListBlock, DividerBlock } from "./components/dividers"
import { TableBlock, TableRow } from "./components/tables"
import { LinkBookmark } from "./components/link-previews"
import { AudioBlock, EmbedBlock, FileBlock, ImageBlock, PDFBlock, VideoBlock } from "./components/embeds"
import { CodeBlock, EquationBlock } from "./components/exotic-texts"


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

export async function NotionASTRenderer({ ast, ...rest }: {
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
    'bookmark': LinkBookmark,
    'video': VideoBlock,
    'image': ImageBlock,
    'pdf': PDFBlock,
    'audio': AudioBlock,
    'file': FileBlock,
    'embed': EmbedBlock,

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

  return <NotionASTRendererRecursor node={ ast } componentMap={ defaultComponents } />
}

/**
 * 
 * ----------------------------------------------------------
 */

async function NotionASTRendererRecursor({ node, componentMap }: {
  node: NotionASTNode,
  componentMap: NotionASTComponentMap
}) {
  // console.log("> Recursion Notion AST Renderer ")
  // console.log(node.children)

  return await Promise.all(node.children.map(async (childn, index) => {

    const Component = componentMap[childn.type]

    // console.log(childn.type)
    // console.log(Component.toString())

    return (
      <Component
        key={ index }
        node={ childn as never }

      >
        { childn.children &&
          <NotionASTRendererRecursor node={ childn } componentMap={ componentMap } />
        }
      </Component>
    )
  }))

  // return node.children.map((childn, index) => {

  //   console.log("  > Child")

  //   const Component = componentMap[node.type]

  //   return (
  //     <Component
  //       key={ index }
  //       node={ childn as never }

  //     >
  //       { childn.children &&
  //         <NotionASTRendererRecursor node={ childn } componentMap={ componentMap } />
  //       }
  //     </Component>
  //   )
  // })
}
