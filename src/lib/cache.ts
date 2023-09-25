import { memoize } from "nextjs-better-unstable-cache"
import { Data } from "./data"

export const Cache = {

  //Notion
  getArticle: async (slug: string) => {
    return (await Cache.getArticleList()).find(article => article.slug === slug)
  },
  getArticleList: memoize(Data.getArticleList,
    {
      logid: 'Get Article List',
      log: ['datacache'],
      revalidateTags: ['article-list']
    }
  ),
  getChildren: memoize((Data.getChildren),
    {
      logid: 'Get Block Children',
      log: ['datacache'],
      revalidateTags: (blockid) => ['block-children', blockid]
    }
  ),

  // Supabase
  getArticleMetadata: async (slug: string) => {
    return (await Cache.getArticleListMetadata()).find(article => article.slug === slug)
  },
  getArticleListMetadata: memoize(Data.getArticleListMetadata,
    {
      logid: 'Get Article Metadata',
      log: ['datacache'],
      revalidateTags: ['article-list-metadata'],
      duration: 3600,
    }
  ),
} satisfies Partial<typeof Data> & { [key: string]: any }