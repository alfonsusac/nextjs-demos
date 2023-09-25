import notion from "./notion"
import { flattenRichText } from "@/components/notion/rsc/rich-texts/utils"
import { ListBlockChildrenResponse, PageObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import supabase from "./supabase"
import { memoize } from "nextjs-better-unstable-cache"
import { validateBlock } from "@/components/notion/utils"
import { delay } from "./memoize"

const database_id = '3a6b7f9f0fed440e924494b2c64dc10d'

export const Data = {
  
  // Notion
  async getArticleList() {
    const response = await notion.databases.query({
      database_id,
      filter: {
        and: [
          { property: 'Publish', checkbox: { equals: true } },
          { property: 'slug', rich_text: { is_not_empty: true } }
        ]
      }
    })

    return response.results.map(result => transformPageData(result as PageObjectResponse))
  },


  async getChildren(block_id: string) {
    // await delay(2000)
    // if(Math.random() > 0.2) throw "Intentional getChildren Error"
    const response = await notion.blocks.children.list({ block_id })
    return response.results.map(block => validateBlock(block))
  },

  // Supabase
  async getArticleListMetadata() {
    return (await supabase.from("Article").select("*")).data ?? []
  }
}



export type TransformedNotionPageData = ReturnType<typeof transformPageData>

function transformPageData(result: PageObjectResponse) {
  const { parent, ...page } = result as PageObjectResponse
  const nameProp = page.properties.Name as {
    type: "title"
    title: Array<RichTextItemResponse>
    id: string
  }
  const slugProp = page.properties.slug as {
    type: "rich_text"
    rich_text: Array<RichTextItemResponse>
    id: string
  }
  const rawTitle = flattenRichText(nameProp.title)
  return {
    ...page,
    title: nameProp.title,
    flattenedTitle: rawTitle,
    slug: flattenRichText(slugProp.rich_text),
    views: null as null | number
  }
}