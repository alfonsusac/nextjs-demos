import { cache } from "react"
import { NumberPropertyItemObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"


const VIEWS_DATABASE_ID = '9cfc93a146084f309103d7727cb546b5'

// export const getViewCount = cache(
//   async (slug: string) => {
//     // Find entry in database
//     const response = await notion.databases.query({
//       database_id: VIEWS_DATABASE_ID,
//       filter: {
//         property: "Name",
//         rich_text: { equals: slug }
//       }
//     })
//     const page = response.results[0] as PageObjectResponse

//     if (!page) return { viewCount: undefined, pageid: undefined }

//     const countProp = (page.properties.Count as NumberPropertyItemObjectResponse) ?? {}
//     const viewCount = (countProp.number ?? 0)

//     return { viewCount, pageid: page.id }

//   }
// )

// export const getAndAddViewCount = cache(
//   async (slug: string) => {

//     const { viewCount, pageid } = await getViewCount(slug)

//     console.log("slug: " + slug)

//     // // Find entry in database
//     // const response = await notion.databases.query({
//     //   database_id: VIEWS_DATABASE_ID,
//     //   filter: {
//     //     property: "Name",
//     //     rich_text: { equals: slug }
//     //   }
//     // })
//     // const page = response.results[0] as PageObjectResponse




//     if (viewCount) {
//       // const countProp = (page.properties.Count as NumberPropertyItemObjectResponse) ?? {}
//       // const viewCount = (countProp.number ?? 0) + 1
//       // Update if found
//       await notion.pages.update({
//         page_id: pageid,
//         properties: {
//           'Count': { number: viewCount }
//         }
//       })
//       return viewCount
//     }



//     if (!viewCount) {
//       // Create if not found
//       await notion.pages.create({
//         parent: {
//           type: 'database_id',
//           database_id: VIEWS_DATABASE_ID,
//         },
//         properties: {
//           'Name': {
//             title: [{ text: { content: slug } },]
//           },
//           'Count': {
//             number: 1
//           }
//         }
//       })
//       return 1
//     }




//   }
// )