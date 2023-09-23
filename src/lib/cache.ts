import { memoize } from "nextjs-better-unstable-cache"
import { Data } from "./data"

export const Cache: Partial<typeof Data> = {

  //Notion
  getArticle: memoize(Data.getArticle,
    {
      logid: 'Get Article',
      revalidateTags: (slug) => ['articles', slug],
    }
  ),
  getArticleList: memoize(Data.getArticleList,
    {
      logid: 'Get Article List',
      revalidateTags: ['article-list']
    }
  ),

  // Supabase
  getArticleListMetadata: memoize(Data.getArticleListMetadata,
    {
      logid: 'Get Article Metadata',
      revalidateTags: ['article-list-metadata'],
      duration: 3600,
    }
  ),
}