import { getPageDetails } from "@/app/articles/[slug]/page.data"
import { Audit } from "@/components/timer"
import notion from "@/lib/notion"
import { nanoid } from "nanoid"
import { NextResponse } from "next/server"
import { memoize } from "nextjs-better-unstable-cache"

export type GetDataResponse = Awaited<
  ReturnType<
    typeof GET
  >
> extends NextResponse<infer T> ? T : never


const ARTICLE_DATABASE_ID = '3a6b7f9f0fed440e924494b2c64dc10d'

//"test-image-cover--headings"
//"5261ab10-b496-4fac-a499-661259b5b876"

export const dynamic = 'force-dynamic'

export async function GET() {

  // const data = await getPageDetails("stress-test-notion-2")
  const audit = new Audit('', false )

  // const data = memoize(
  //   async () => await notion.databases.query({
  //     database_id: ARTICLE_DATABASE_ID,
  //     filter: {
  //       property: "slug",
  //       rich_text: { equals: "stress-test-notion-2" }
  //     }
  //   }),
  //   {
  //     duration: 4,
  //     log: ['datacache', 'verbose']
  //   }
  // )()
  // const data = await notion.blocks.children.list({
  //   block_id: "5261ab10-b496-4fac-a499-661259b5b876",
  //   page_size: 1000,
  // })

  // const data = await notion.blocks.retrieve({
  //   block_id: "5261ab10-b496-4fac-a499-661259b5b876",
  // })

  const data = Math.random().toPrecision(3)

  audit.total()
  const date = Date.now()
  return NextResponse.json({
    data, date
  })
}

