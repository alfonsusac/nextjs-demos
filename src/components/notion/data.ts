import { NumberPropertyItemObjectResponse, PageObjectResponse, RichTextItemResponse, RichTextPropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { slug as slugify } from "github-slugger"
import { cache } from "react"
import { notion } from "./data/init"


const ARTICLE_DATABASE_ID = '3a6b7f9f0fed440e924494b2c64dc10d'


export const getArticlePage = cache(
  async (slug: string) => {

    const res = await notion.databases.query({
      database_id: ARTICLE_DATABASE_ID,
      filter: {
        property: "slug",
        rich_text: { equals: slug }
      }
    })

    if (res.results.length === 0) {
      const articles = await getArticles()

      const article = articles.find(r => r.slug === slug)
      if (!article)
        return undefined

      console.log("UPDATE SLUG")
      await notion.pages.update({
        page_id: article.id,
        properties: {
          'slug': {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: slug
                }
              }
            ] as any
          }
        }
      })

      return article

    } else {
      const pageRes = (res.results[0] as PageObjectResponse)
      const { id, created_by, last_edited_by, cover, icon, archived, url, properties, created_time, last_edited_time } = pageRes
      const flattenedTitle = flattenNameProp(pageRes.properties.Name as any)
      const nameProp = properties.Name as {
        type: "title"
        title: Array<RichTextItemResponse>
        id: string
      }

      const viewsProp = properties.Views as NumberPropertyItemObjectResponse

      return {
        id,

        created_time,
        last_edited_time,
        created_by,
        last_edited_by,
        archived,

        cover,
        icon,
        url,
        title: nameProp.title,
        flattenedTitle,
        slug: slugify(flattenedTitle),

        views: viewsProp.number ?? 0
      }
    }

  }
)
