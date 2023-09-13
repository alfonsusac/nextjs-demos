import { getArticle } from "@/components/notion/data/articles"
import { getPageContent } from "@/components/notion/data/helper"
import { memoizeInside } from '@/lib/cache'
import { memoize } from 'nextjs-better-unstable-cache'

export async function getPageDetails(slug: string) {
  console.log("Retrieving Page Details")
  const article = await getArticle(slug)
  const content = await getPageContent(article.id)
  return { article, content }
}
export const getData = memoizeInside(
  async (slug: string) => {
    return 5
  },
  {
    revalidateTags: (slug) => ['test', slug]
  }

)


export const getPageData = memoize(
  async (slug: string) => {
    return await getPageDetails(slug)
  },
  {
    revalidateTags: (slug) => ['articles', slug],
    log:['datacache', 'dedupe']
  }
)


// export const getCachedPageDetails = memoize(
//   async (slug: string) => {
//     return persistResult(getPageDetails,
//       { revalidateTags: ['article', slug] }
//     )(slug)
//   }
// )

// async () => {
//   const data = await getCachedPageDetails('123')
// }
