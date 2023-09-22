import notion from "./notion"
import { flattenRichText } from "@/components/notion/rsc/rich-texts/utils"
import { PageObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import supabase from "./supabase"

const database_id = '3a6b7f9f0fed440e924494b2c64dc10d'

export const Data = {
  
  async getArticle(slug: string) {
    const response = await notion.databases.query({
      database_id,
      filter: { property: "slug", rich_text: { equals: slug } }
    })

    return transformPageData(response.results[0] as PageObjectResponse)
  },

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

  async getArticleListMetadata() {
    return (await supabase.from("Article").select("*")).data ?? []
  }
}




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

