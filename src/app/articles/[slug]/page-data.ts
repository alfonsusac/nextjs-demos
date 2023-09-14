import { getArticle } from "@/components/notion/data/articles"
import { getPageContent } from "@/components/notion/data/helper"
import { memoize } from 'nextjs-better-unstable-cache'

export async function getPageDetails(slug: string) {
  console.log("Retrieving Page Details")
  const article = await getArticle(slug)
  const content = await getPageContent(article.id)
  return { article, content }
}

export const getPageData = memoize(
  async (slug: string) => {
    return await getPageDetails(slug)
  },
  {
    revalidateTags: (slug) => ['articles', slug],
    log:['datacache', 'dedupe']
  }
)