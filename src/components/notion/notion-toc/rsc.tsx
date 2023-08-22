import { TOCItemType } from "@/components/toc/rsc"
import { NotionASTNode, visitNotionAST } from "../parser/node"
import { slug } from "github-slugger"

export function extractHeadings(node: NotionASTNode) {
  const headings: TOCItemType[] = []

  visitNotionAST(node, (node) => { 
    
    const text = node.raw_content
    if (!text) return

    const id = slug(text)

    if (node.type === 'heading_1') {
      headings.push({ level: 1, id, text })
    }

    if (node.type === 'heading_2') {
      headings.push({ level: 2, id, text })
    }

    if (node.type === 'heading_3') {
      headings.push({ level: 3, id, text })
    }

  })

  return headings
}