import { cache } from 'react'
import { getArticle } from "@/components/notion/data/articles"
import { getPageContent } from "@/components/notion/data/helper"
import { unstable_cache } from 'next/cache'
import { persistResult } from '@/lib/cache'

async function getPageDetails(slug: string) {
  console.log("Retrieving Page Details")
  const article = await getArticle(slug)
  const content = await getPageContent(article.id)
  return { article, content }
}



export const getCachedPageDetails = cache(
  async (slug: string) => {
    return persistResult(getPageDetails,
      { revalidateTags: ['article', slug] }
    )(slug)
  }
)

// const getCachedPageDetails = cache(
//   async (slug: string) =>
//     unstable_cache(
//       getPageDetails,
//       [],
//       { tags: ['article', slug] }
//     )(slug)
// )



async () => {
  const data = await getCachedPageDetails('123')
}
