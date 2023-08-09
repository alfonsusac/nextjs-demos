import { Client } from "@notionhq/client"
import { PageObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { slug } from "github-slugger"
import { cache } from "react"


const globalForNotion = globalThis as unknown as {
  notion: Client | undefined
}

export const notion =
  globalForNotion.notion ?? new Client({ auth: process.env.NOTION_TOKEN })

if (process.env.NODE_ENV !== 'production') {
  globalForNotion.notion = notion
}


function flattenNameProp(Name: {
  type: "title"
  title: Array<RichTextItemResponse>
  id: string
}) {
  return Name.title.map(t => t.plain_text).join('')
}


export const getArticles = cache(async () => {
  const data = await notion.databases.query({
    database_id: '3a6b7f9f0fed440e924494b2c64dc10d',
    filter: {
      property: "Published",
      checkbox: {
        equals: true
      }
    }
  })
  const list = data.results.map(e => {

    const {
      id,
      created_time,
      last_edited_time,
      created_by,
      last_edited_by,
      cover,
      icon,
      archived,
      url,
      properties
    } = (e as PageObjectResponse)

    const title = flattenNameProp(properties.Name as any)

    return {
      id,
      created_time: new Date(created_time),
      last_edited_time: new Date(last_edited_time),
      created_by,
      last_edited_by,
      cover,
      icon,
      archived,
      url,
      title,
      slug: slug(title)
    }

  })
  return list
})

export const getArticlePage = cache(async (page_id: string) => {
  const data = await notion.pages.retrieve({
    page_id,
  })
})

