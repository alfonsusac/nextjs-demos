import { Client } from "@notionhq/client"

const globalForNotion = globalThis as unknown as {
  notion: Client | undefined
}

export const notion =
  globalForNotion.notion ?? (() => {
    // console.log("Creating new Notion Client...")
    return new Client({ auth: process.env.NOTION_TOKEN })
  })()

if (process.env.NODE_ENV !== 'production') {
  // console.log("Production")
  globalForNotion.notion = notion
}