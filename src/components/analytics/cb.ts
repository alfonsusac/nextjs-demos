'use server'

import { notion } from "../notion/data/init"
import { VIEWSPROPID } from "./server"

export async function AddViewCount(page_id: string) {
  console.log("GET & ADD VIEW COUNT")

  try {
    const res = await notion.pages.properties.retrieve({
      page_id,
      property_id: VIEWSPROPID
    }) as any

    const viewCount = res.number


    const res2 = await notion.pages.update({
      page_id,
      properties: {
        'Views': {
          number: viewCount + 1
        }
      }
    })

    // return viewCount + 1

  } catch (error) {
    // return JSON.stringify(error)
  }
}