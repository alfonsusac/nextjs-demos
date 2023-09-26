import { NotionASTNode } from "../../parser/node"
import { NodeTypes } from "../../types"
import { H2 } from "@/components/typography"
import { Toggle } from "../../client"
import { NotionRichText } from "../rich-texts/parser"
import { BulletedList, NumberedList, TodoList } from "../components/lists"
import { ListItem } from "../components/list-items"
import { HeadingBuilder } from "../components/headings"
import { CalloutBlock, Paragraph, QuoteBlock, ToggleBlock } from "../components/nestables"
import { ColumnBlock, ColumnListBlock, DividerBlock } from "../components/dividers"
import { TableBlock, TableRow } from "../components/tables"
import { NotionLinkBookmark } from "../components/link-previews"
import { AudioBlock, EmbedBlock, FileBlock, ImageBlock, PDFBlock, VideoBlock } from "../components/embeds"
import { CodeBlock, EquationBlock } from "../components/exotic-texts"
import { Audit } from "@/components/timer"
import { getPageContent } from "@/data/helper"
import { Suspense } from "react"
import { Cache } from "@/lib/cache"
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { convertBlockListToASTSync } from "../../parser/parser"
import { ClientActionRunner } from "../../parser/client"
import { delay } from "@/lib/memoize"
import { Procedure } from "@/lib/procedures"
import { RendererErrorBoundary } from "./client"


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
  'bookmark': NotionLinkBookmark, // async
  'video': VideoBlock,
  'image': ImageBlock, // async
  'pdf': PDFBlock,
  'audio': AudioBlock,
  'file': FileBlock, // async
  'embed': EmbedBlock, // async

  // ※ Not Implemented
  // 'template': () => <></>,
  // 'synced_block': () => <></>,
  // 'child_page': () => <></>,
  // 'child_database': () => <></>,
  // 'breadcrumb': () => <></>,
  // 'table_of_contents': () => <></>,
  // 'link_to_page': () => <></>,
  // 'link_preview': () => <></>,
  // 'unsupported': () => <></>,
  // 'root': () => <></>,

}

export async function PageRenderer({ blockID }: {
  blockID: string,
}) {

  // Get Children of a block id. Time Limit to 100
  // If cached then return directly.
  // If not cached then resort to server action from client component
  // If error then show client boundary with retry button. (also client component)

  try {
    const { res: children, timelimit } = await Procedure.maxTime(Cache.getChildren(blockID), 1)

    if (!timelimit) {
      console.log("SSR: " + blockID)
      return <BlockListRenderer blockList={ children } />
    }

    if (timelimit) {
      console.log("Client Rendering: " + blockID)
      return <ClientActionRunner param={ [] } action={ async () => {
        "use server"
        console.log("Fetching in server action... " + blockID)
        const { res: children, timelimit } = await Procedure.maxTime(Cache.getChildren(blockID), 9000)
        if (timelimit) return "Time Limit Reached"
        return <BlockListRenderer blockList={ children } />
      } } />
    }

  } catch (error) {
    console.log("Error for blockid: " + blockID)
    return <ClientActionRunner error={ JSON.stringify(error) } param={ [] } action={ async () => {
      "use server"
      const { res: children, timelimit } = await Procedure.maxTime(Cache.getChildren(blockID), 9000)
      if (timelimit) return "Time Limit Reached"
      return <BlockListRenderer blockList={ children } />
    } } />
  }
}


function BlockListRenderer({ blockList }: { blockList: BlockObjectResponse[] }) {

  const root = convertBlockListToASTSync(blockList)
  return root.children.map((node, i) => (
    <NodeRenderer componentMap={ defaultComponents } node={ node } key={ i } />
  ))

}


/** ----------------------------------------------------------
 * Entry Point
 * 
 * 
 */
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
  [key in NotionASTNode['type']]?: (param: NotionComponentProp<key>) => React.ReactNode
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




// export function NotionASTRenderer({ ast, ...rest }: {
//   ast: NotionASTNode,
//   components?: NotionASTComponentMap
// }) {
//   const RenderResult = <NotionASTRendererRecursor node={ ast } componentMap={ defaultComponents } />
//   return RenderResult
// }

/**
 * 
 * ----------------------------------------------------------
 */

// function NotionASTRendererRecursor({ node, componentMap }: {
//   node: NotionASTNode,
//   componentMap: NotionASTComponentMap
// }) {
//   return node.children.map((childnode, index) => (
//     <NodeRenderer node={ childnode } componentMap={ componentMap } key={ index } />
//   ))
// }


async function NodeRenderer({ node, componentMap, children }: {
  node: NotionASTNode,
  componentMap: NotionASTComponentMap,
  children?: React.ReactNode
}) {
  const Component = componentMap[node.type]
  if (!Component) return <></>
  console.log("NotionASTNodeComponent: " + node.type)

  try {
    (await (Component as any)({ node }))
  } catch (error: any) {
    console.error(error)
    return <div>
      Error Rendering block id { node.id }
      <div className="opacity-50">
        {error.toString()}
      </div>
    </div>
  }

  return (
    <Component node={ node as never }>
      { node.children && node.children.map((child, index) => (
        <NodeRenderer node={ child } componentMap={ componentMap } key={ index } />
      ))
      }
      { node.has_children && (
        <Suspense fallback="Loading nested blocks.." >
          <PageRenderer blockID={ node.id } />
        </Suspense>
      )
      }
    </Component>
  )


}