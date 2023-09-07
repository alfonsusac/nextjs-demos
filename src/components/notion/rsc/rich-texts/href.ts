import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { slug } from "github-slugger"
import { unstable_cache } from "next/cache"
import notion from "@/lib/notion"
import { flattenRichText } from "./utils"
import { Audit } from "@/components/timer"

export async function parseNotionHref(c: string) {
  if (c.startsWith('/')) {

    const blockid = c.split('#')[1]
    if (blockid) {
      try {
        return await getNotionAnchorHref(blockid)
      } catch (error) {
        console.log("ERROR: error parsing notion href: " + c)
        console.log(error)
        return c
      }
    } else {
      return `https://alfonsusardani.notion.site${c}`
    }
  } else {
    return c
  }
}


async function getNotionAnchorHref(blockid: string) {
  const audit = new Audit(' Parsing Notion Anchor Href', false)
  
  const blockdata = await unstable_cache(
    async () => await notion.blocks.retrieve({
      block_id: blockid
    }) as any,
    [blockid]
  )()

  const rich_text = blockdata[blockdata.type!].rich_text as RichTextItemResponse[]
  const text = flattenRichText(rich_text)!
  const anchorlink = `#${slug(text)}`
  audit.total()
  return anchorlink
}
