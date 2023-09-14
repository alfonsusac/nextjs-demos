import { getArticle } from "@/components/notion/data/articles"
import { getPageContent } from "@/components/notion/data/helper"
import { extractHeadings } from "@/components/notion/notion-toc/rsc"
import { convertChildrenToAST } from "@/components/notion/parser/parser"
import { memoize } from 'nextjs-better-unstable-cache'

export async function getPageDetails(slug: string) {
  console.log("Retrieving Page Details")
  const article = await getArticle(slug)
  const content = await getPageContent(article.id)
  const ast = await convertChildrenToAST(content)
  const heading = extractHeadings(ast)
  return { article, content, ast: loremIpsumDolorSitAmetConsecteturAdipiscingElitSedNonRisusSuspendisseLectusTortorDignissimSitAmetAdipiscingNecUltriciesSedDolorCrasElementumUltricesDiamMaecenasLigulaMassaVariusASemperCongueEuismodNonMi(ast), heading }
}

function loremIpsumDolorSitAmetConsecteturAdipiscingElitSedNonRisusSuspendisseLectusTortorDignissimSitAmetAdipiscingNecUltriciesSedDolorCrasElementumUltricesDiamMaecenasLigulaMassaVariusASemperCongueEuismodNonMi(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export const getPageData = memoize(getPageDetails,
  {
    revalidateTags: (slug) => ['articles', slug],
    log:['datacache']
  }
)