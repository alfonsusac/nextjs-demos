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

const getCachedPageDetails = cache(unstable_cache(async (slug:string) => await getPageDetails(slug), [], { tags: ['articles'] }))

async () => {
  const data = await getCachedPageDetails('123')
}

function memoize()