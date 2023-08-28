import { cache } from "react"
import { notion } from "./init"
import { NumberPropertyItemObjectResponse, PageObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { flattenRichText } from "../rsc/rich-text"
import { slug as slugify } from "github-slugger"

const ARTICLE_DATABASE_ID = '3a6b7f9f0fed440e924494b2c64dc10d'

export const getPage = cache(
  async (slug: string) => {

    // Search using slug
    const response = await notion.databases.query({
      database_id: ARTICLE_DATABASE_ID,
      filter: {
        property: "slug",
        rich_text: { equals: slug }
      }
    })

    // 
    if (response.results.length === 0) {

    }

  }
) 

export const getArticleList = cache(
  async () => {

    const response = await notion.databases.query({
      database_id: ARTICLE_DATABASE_ID,
      filter: {
        property: "Published",
        checkbox: { equals: true }
      }
    })

    return  response.results.map(
      result => {

        const { parent, ...page} = result as PageObjectResponse
        const nameProp = page.properties.Name as {
          type: "title"
          title: Array<RichTextItemResponse>
          id: string
        }
        const viewsProp = page.properties.Views as NumberPropertyItemObjectResponse
        const rawTitle = flattenRichText(nameProp.title)

        return {
          ...page,
          title: nameProp.title,
          flattenedTitle: rawTitle,
          slug: slugify(rawTitle),
          views: viewsProp.number ?? 0
        }

      }
    )

  }
)