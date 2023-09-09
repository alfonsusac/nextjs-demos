import { cache } from 'react'
import { getArticle } from "@/components/notion/data/articles"
import { getPageContent } from "@/components/notion/data/helper"
import { unstable_cache } from 'next/cache'

async function getPageDetails(slug: string) {
  console.log("Retrieving Page Details")
  const article = await getArticle(slug)
  const content = await getPageContent(article.id)
  return { article, content }
}

// const getCachedPageDetails = cache(unstable_cache(
//   async (slug: string) => await getPageDetails(slug), [], { tags: ['articles'] }
// ))
// const getCachedPageDetails = cache(
//   unstable_cache(
//     async (slug: string) => {
//       return await getPageDetails(slug)
//     },
//     [],
//     { tags: [] }
//   )
// )

export const getCachedPageDetails = cache(
  async (slug: string, source: string) => {
    console.log("Memoizing - Page Details | source: " + source)
    return await unstable_cache(
      async () => {
        console.log("Caching - Page Details | source: " + source)
        return await getPageDetails(slug)
      },
      [slug],
      { tags: ['article', slug] }
    )()
  }
)
// const getCachedPageDetails = cache(

//   async (slug: string) => {
//     return await unstable_cache(
//       async () => await getPageDetails(slug),
//       [slug],
//       { tags: ['article', slug] }
//     )()
//   }

// )

async () => {
  const data = await getCachedPageDetails('123', "Test")
}
