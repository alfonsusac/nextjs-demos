import { Client, LogLevel } from "@notionhq/client"
import chalk from "chalk"

const notionClientSingleton = () => {
  // console.log("Creating new Notion Client...")
  return new Client({
    auth: process.env.NOTION_TOKEN,
    timeoutMs: 5000,
    logLevel: LogLevel.DEBUG, 
    logger(level: LogLevel, message: string, extraInfo: Record<string, unknown>) {
      console.log(`Notion: ${chalk.cyan(level)} ${message}`)
      console.log(chalk.gray(JSON.stringify(extraInfo, null,2)))
    }
  })
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