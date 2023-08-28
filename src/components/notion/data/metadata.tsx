import { cache } from "react"
import { notion } from "./init"
import { NumberPropertyItemObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"


const VIEWS_DATABASE_ID = '76c4a472dd0c4473a33f2e47270dc442'

export const getAndAddViewCount = cache(
  async (slug: string) => {
    // Find entry in database
    const response = await notion.databases.query({
      database_id: VIEWS_DATABASE_ID,
      filter: {
        property: "",
        rich_text: { equals: slug }
      }
    })
    const page = response.results[0] as PageObjectResponse




    if (page) {
      const viewsProp = (page.properties.Views as NumberPropertyItemObjectResponse) ?? {}
      const viewCount = (viewsProp.number ?? 0) + 1
      // Update if found
      await notion.pages.update({
        page_id: page.id,
        properties: {
          'Count': { number: viewCount }
        }
      })
      return viewCount
    }



    if (!page) {
      // Create if not found
      await notion.pages.create({
        parent: {
          type: 'database_id',
          database_id: VIEWS_DATABASE_ID,
        },
        properties: {
          'Name': {
            title: [{ text: { content: slug } },]
          },
          'Count': {
            number: 1
          }
        }
      })
      return 1
    }




  }
)