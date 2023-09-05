import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { slug } from "github-slugger"
import { unstable_cache } from "next/cache"
import notion from "@/lib/notion"
import { flattenRichText } from "./utils"

async function parseNotionHref(c: string) {
  if (c.startsWith('/')) {
    const blockid = c.split('#')[1]
    try {

      const blockdata = await unstable_cache(
        async () => await notion.blocks.retrieve({
          block_id: blockid
        }) as any, [blockid]
      )()

      const rich_text = blockdata[blockdata.type!].rich_text as RichTextItemResponse[]
      const text = flattenRichText(rich_text)!
      const anchorlink = `#${slug(text)}`
      return anchorlink
    } catch (error) {
      console.log(error)
      return c
    }
  } else {
    return c
  }
}

