import { getArticle } from "@/data/articles"
import { extractHeadings } from "@/components/notion/notion-toc/rsc"
import { NotionASTNode } from "@/components/notion/parser/node"
import { convertChildrenToAST } from "@/components/notion/parser/parser"
import { memoizeTesting } from "@/lib/memoize"
import supabase from "@/lib/supabase"
import { memoize } from 'nextjs-better-unstable-cache'
import { getPageContent } from "@/data/helper"

export const getPageData = memoize(
  async function getPageData(slug: string) {
    const res = await supabase.from('Article').select('*').eq('slug', slug)
    
    console.log(res)

    // find unique
    if (!res.data || !res.data[0]) return false

    return {
      ...res.data[0],
      ast: res.data[0].content as unknown as NotionASTNode,
      article: res.data[0].data as Awaited<ReturnType<typeof getArticle>>
    }
  },
  {
    // persist: false,
    duration: 3600,
    log: ['datacache', 'verbose', 'dedupe'],
    logid: "Get Page Data",
  }
)

export const getCachedPageDetails = memoizeTesting(
  getPageDetails,
  {
    revalidateTags: (slug) => ['articles', slug],
    log: ['datacache', 'verbose', 'dedupe'],
  }
)

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

