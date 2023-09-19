import { cache } from "react"
import { notion } from "../../../lib/notion"
import { PageObjectResponse, RichTextItemResponse, RichTextPropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { flattenRichText } from "../rsc/rich-texts/utils"


const ARTICLE_DATABASE_ID = '3a6b7f9f0fed440e924494b2c64dc10d'

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


export const getArticleList = cache(
  async () => {
    const response = await notion.databases.query({
      database_id: ARTICLE_DATABASE_ID,
      filter: {
        and: [
          { property: 'Publish', checkbox: { equals: true } },
          { property: 'slug', rich_text: { is_not_empty: true } }
        ]
      }
    })
    return response.results.map(
      result => {
        return transformPageData(result as PageObjectResponse)
      }
    )
  }
)



export const getArticle = cache(
  async (slug: string) => {
    // Search using slug
    const response = await notion.databases.query({
      database_id: ARTICLE_DATABASE_ID,
      filter: {
        property: "slug",
        rich_text: { equals: slug }
      }
    })
    return transformPageData(response.results[0] as PageObjectResponse)
  }
)
