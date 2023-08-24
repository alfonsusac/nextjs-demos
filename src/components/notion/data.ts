import { NumberPropertyItemObjectResponse, PageObjectResponse, RichTextItemResponse, RichTextPropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { slug as slugify } from "github-slugger"
import { cache } from "react"
import { notion } from "./data/init"


export const getArticlePage = cache(async (slug: string) => {
  
  const res = await notion.databases.query({
    database_id: '3a6b7f9f0fed440e924494b2c64dc10d',
    filter: {
      property: "slug",
      rich_text: { equals: slug }
    }
  })

  console.log("INITIAL FETCH")

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

  }  else {
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

})


export const getPageContent = cache(async (id: string) => {
  return await notion.blocks.children.list({
    block_id: id,
  })
})

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
    },
  })
  const list = data.results.map(e => {

    const pageRes = (e as PageObjectResponse)
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

  })
  return list
})

