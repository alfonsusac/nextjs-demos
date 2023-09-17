import { Client, LogLevel } from "@notionhq/client"
import chalk from "chalk"

const notionClientSingleton = () => {
  // console.log("Creating new Notion Client...")
  return new Client({
    auth: process.env.NOTION_TOKEN,
    timeoutMs: 5000,
    logLevel: LogLevel.DEBUG, 
    logger(level: LogLevel, message: string, extraInfo: Record<string, unknown>) {
      // console.log(`Notion: ${chalk.cyan(level)} ${message}`)
      if (level === LogLevel.WARN)
        console.log(`Notion: ${chalk.redBright(level)} ${message}`)
      console.log(`${level}: ${message} ${ chalk.gray(JSON.stringify(extraInfo))}`)
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