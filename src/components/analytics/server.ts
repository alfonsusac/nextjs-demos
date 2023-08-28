'use server'

import { notion } from "../notion/data/init"


export const VIEWSPROPID = "hrW%7B"

export async function getViewCount(p: {
  pageID: string,
}) {
  console.log("GET VIEW COUNT")
  
  try {
    const res = await notion.pages.properties.retrieve({
      page_id: p.pageID,
      property_id: VIEWSPROPID
    }) as any

    // console.log(res)

    return res.number
  } catch (error) {
    return JSON.stringify(error)
  }

}


export async function getAndAddViewCount(p: {
  pageID: string,
}) {
  console.log("GET & ADD VIEW COUNT")
  
  try {
    const res = await notion.pages.properties.retrieve({
      page_id: p.pageID,
      property_id: VIEWSPROPID
    }) as any
    
    // console.log(res)

    const viewCount = res.number


    const res2 = await notion.pages.update({
      page_id: p.pageID,
      properties: {
        'Views': {
          number: viewCount + 1
        }
      }
    })

    // console.log(res2)

    return viewCount + 1

  } catch (error) {
    return JSON.stringify(error)
  }

}