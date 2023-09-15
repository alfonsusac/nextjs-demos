import { getArticle } from "@/components/notion/data/articles"
import { getPageContent } from "@/components/notion/data/helper"
import { extractHeadings } from "@/components/notion/notion-toc/rsc"
import { convertChildrenToAST } from "@/components/notion/parser/parser"
import { memoizeTesting } from "@/lib/cache"
import supabase from "@/lib/supabase"
import { revalidateTag, unstable_cache } from "next/cache"
import { memoize } from 'nextjs-better-unstable-cache'

export async function getPageDetails(slug: string) {
  const article = await getArticle(slug)
  const content = await getPageContent(article.id)
  const ast = await convertChildrenToAST(content)
  const headings = extractHeadings(ast)
  return {
    article,
    content,
    headings,
    ast: loremIpsumDolorSitAmetConsecteturAdipiscingElitSedNonRisusSuspendisseLectusTortorDignissimSitAmetAdipiscingNecUltriciesSedDolorCrasElementumUltricesDiamMaecenasLigulaMassaVariusASemperCongueEuismodNonMi(ast)
  }
}

function loremIpsumDolorSitAmetConsecteturAdipiscingElitSedNonRisusSuspendisseLectusTortorDignissimSitAmetAdipiscingNecUltriciesSedDolorCrasElementumUltricesDiamMaecenasLigulaMassaVariusASemperCongueEuismodNonMi(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export const getCachedPageDetails = memoizeTesting(
  getPageDetails,
  {
    revalidateTags: (slug) => ['articles', slug],
    log: ['datacache', 'verbose'],
  }
)

async function getPageMetadata(id: string) {
  const metadata = { views: 0 }
  try {
    const res = await supabase.from('Article')
      .select('views')
      .eq('id', id)
    const views = res.data?.[0]?.views
    if (!views) {
      await supabase.from('Article')
        .insert({ id, views: 0 })
    }
    if (views) {
      metadata.views = views
    }
  } catch (error) {
    console.log("Error getting views")
    console.error(error)
  }
  return metadata
}

export const getCachedPageMetadata = memoize(
  getPageMetadata,
  {
    duration: 3600,
    log: ['datacache', 'verbose']
  }
)


// const bgodr = unstable_cache(
//   unstable_cache(
//     getPageDetails,
//     [], { revalidate: 1 }
//   ),
//   [], { tags: ['data'] }
// )

// revalidateTag('data') 
// First access
// 1. will MISS, run outer unstable_cache
// 2. will MISS, run inner unstable_cache, returning old data
// 3.  background revalidated

// Second access
// 1. will HIT cached outer unstable_cache