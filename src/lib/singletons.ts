import { createClient } from "@supabase/supabase-js"
import { Database } from "./database.types"
import nodeFetch from "node-fetch"
import { Client, LogLevel } from "@notionhq/client"
import chalk from "chalk"
import { PrismaClient } from "@prisma/client"

const supabaseClientSingleton = () =>
  createClient<Database>(
    'https://yjccvjyuflpawraittig.supabase.co',
    process.env.SUPABASE_SERVICE_KEY ?? '',
    {
      auth: { persistSession: false },
      global: { fetch: nodeFetch as unknown as typeof fetch}
    }
  )
const notionClientSingleton = () => new Client({
  auth: process.env.NOTION_TOKEN,
  timeoutMs: 3000,
  logLevel: LogLevel.DEBUG,
  logger(level: LogLevel, message: string, extraInfo: Record<string, unknown>) {
    // console.log(`Notion: ${chalk.cyan(level)} ${message}`)
    if (level === LogLevel.WARN)
      console.log(`Notion: ${chalk.redBright(level)} ${message}`)
    console.log(`${level}: ${message} ${chalk.gray(JSON.stringify(extraInfo))}`)
  }
})
const prismaClientSingleton = () => new PrismaClient({
  errorFormat: 'pretty'
})

const globalForSingleton = globalThis as unknown as {
  supabase?: ReturnType<typeof supabaseClientSingleton>
  notion?: ReturnType<typeof notionClientSingleton>
  prisma?: ReturnType<typeof prismaClientSingleton>
}

export const supabase = globalForSingleton.supabase ?? supabaseClientSingleton()
export const notion = globalForSingleton.notion ?? notionClientSingleton()
export const prisma = globalForSingleton.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForSingleton.supabase = supabase
  globalForSingleton.notion = notion
  globalForSingleton.prisma = prisma
}
