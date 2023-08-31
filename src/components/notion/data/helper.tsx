import { notion } from "../../../lib/notion"
import { cache } from "react"

export const getPageContent = cache(
  async (block_id: string) => {
    return await notion.blocks.children.list({
      block_id: block_id,
    })
  }
)