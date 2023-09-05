import { Client } from "@notionhq/client"

const notionClientSingleton = () => {
  // console.log("Creating new Notion Client...")
  return new Client({ auth: process.env.NOTION_TOKEN })
}

type NotionClientSingleton = ReturnType<typeof notionClientSingleton>

const globalForNotion = globalThis as unknown as {
  notion: NotionClientSingleton | undefined
}

export const notion = globalForNotion.notion ?? notionClientSingleton()

export default notion

if (process.env.NODE_ENV !== 'production') {
  globalForNotion.notion = notion
}