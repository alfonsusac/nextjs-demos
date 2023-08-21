// import { AudioBlockObjectResponse, BlockObjectResponse, BookmarkBlockObjectResponse, BreadcrumbBlockObjectResponse, BulletedListItemBlockObjectResponse, CalloutBlockObjectResponse, ChildDatabaseBlockObjectResponse, ChildPageBlockObjectResponse, CodeBlockObjectResponse, ColumnBlockObjectResponse, ColumnListBlockObjectResponse, DividerBlockObjectResponse, EmbedBlockObjectResponse, EquationBlockObjectResponse, FileBlockObjectResponse, Heading1BlockObjectResponse, Heading2BlockObjectResponse, Heading3BlockObjectResponse, ImageBlockObjectResponse, LinkPreviewBlockObjectResponse, LinkToPageBlockObjectResponse, ListBlockChildrenResponse, NumberedListItemBlockObjectResponse, ParagraphBlockObjectResponse, PartialBlockObjectResponse, PdfBlockObjectResponse, QuoteBlockObjectResponse, RichTextItemResponse, SyncedBlockBlockObjectResponse, TableBlockObjectResponse, TableOfContentsBlockObjectResponse, TableRowBlockObjectResponse, TemplateBlockObjectResponse, ToDoBlockObjectResponse, ToggleBlockObjectResponse, UnsupportedBlockObjectResponse, VideoBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
// import { notion } from "./data"
// import { NotionASTNode } from "./parser/node"



// type UnknownJSONList = any[]
// type OnMapToASTCallback = (newNode: NotionASTNode, curerntNode: NotionASTNode) => void
// type OnMapToASTCallbackMap = { [key in BlockType]?: OnMapToASTCallback }
// type BlockType = BlockObjectResponse['type']

// export async function convertChildrenToAST(
//   data: ListBlockChildrenResponse,
//   options?: Parameters<typeof mapBlockListToAST>[2]
// ) {
//   const root = new NotionASTNode()

//   const defaultOptions: Parameters<typeof mapBlockListToAST>[2] = {
//     async fetchChildrenCallback(id) {
//       return await notion.blocks.children.list({ block_id: id })
//     },
//     ASTCallbackMap: {
//       'bulleted_list_item': GroupListTogether,
//       'numbered_list_item': GroupListTogether,
//       'to_do': GroupListTogether
//     }
//   }

//   const fetchChildrenCallback =
//     options?.fetchChildrenCallback
//     ?? (async (id) => {
//       return await notion.blocks.children.list({ block_id: id })
//     })

//   let ASTCallbackMap: OnMapToASTCallbackMap = defaultOptions.ASTCallbackMap
//   if (options?.ASTCallbackMap) {
//     ASTCallbackMap = { ...defaultOptions, ...options.ASTCallbackMap }
//   }

//   await mapBlockListToAST(data.results, root, {
//     ASTCallbackMap,
//     fetchChildrenCallback
//   })

//   return { ast: root, unknowns: [] }
// }


// export const GroupListTogether: OnMapToASTCallback = (newNode, currentNode) => {

//   const lastChildNode = currentNode.children.at(-1)
//   newNode.type = 'list_item'

//   if (lastChildNode?.type === newNode.type) {
//     newNode.parent = lastChildNode
//     lastChildNode.children.push(newNode)
//   } else {
//     const newListGroupNode = new NotionASTNode(currentNode)
//     newNode.parent = newListGroupNode
//     newListGroupNode.type = newNode.type
//     newListGroupNode.is_group = true
//     newListGroupNode.children.push(newNode)
//     currentNode.children.push(newListGroupNode)
//   }

// }




// // Setting up for recursion
// async function mapBlockListToAST(
//   list: ListBlockChildrenResponse['results'],
//   currentNode: NotionASTNode,
//   options: {
//     createSectionAtEveryHeading?: true,
//     fetchChildrenCallback:
//     (id: string) => Promise<ListBlockChildrenResponse>,
//     ASTCallbackMap: OnMapToASTCallbackMap
//   }
// ) {
//   const ASTCallbackMap = options?.ASTCallbackMap

//   await Promise.allSettled(list.map(async unknownblock => {

//     const block = validateBlock(unknownblock)
//     const newNode = parseBlockToAST(currentNode, block, ASTCallbackMap)

//     if (block.has_children === true) {
//       const children = await options.fetchChildrenCallback(block.id)
//       await mapBlockListToAST(children.results, newNode, options)
//     }

//   }))
// }





// function validateBlock(unknownblock: PartialBlockObjectResponse | BlockObjectResponse) {
//   if (
//     'type' in unknownblock === false
//     || unknownblock.object !== 'block'
//   ) {
//     console.log("Unknown object type: " + unknownblock)
//     throw "Partial/Invalid Block"
//   }
//   return unknownblock as BlockObjectResponse
// }

// function parseBlockToAST(
//   currentNode: NotionASTNode,
//   block: BlockObjectResponse,
//   ASTCallbackMap: OnMapToASTCallbackMap,
// ) {
//   const defaultOnMap: OnMapToASTCallback = (newNode, currentNode) => {
//     currentNode.pushChild(newNode)
//   }
//   const onNewNodeCreate = ASTCallbackMap[block.type] ?? defaultOnMap
//   const newnode = new NotionASTNode(currentNode, block)
//   onNewNodeCreate(newnode, currentNode)
//   return newnode
// }





