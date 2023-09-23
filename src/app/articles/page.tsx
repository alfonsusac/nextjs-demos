import { NotionIcon } from "@/components/notion/rsc/images"
import { Data } from "@/lib/data"
import { Procedure } from "@/lib/procedures"
import { format, getYear } from "date-fns"
import Link from "next/link"
import { memoize } from "nextjs-better-unstable-cache"


export default async function ArticleListPage() {

  // Get data
  const [articles, metadata] = await Procedure.parallel([
    Procedure.prepareForStatic(Data.getArticleList, []),
    Procedure.prepareForStatic(Data.getArticleListMetadata, [])
  ])

  // Process data
  const yearGroup = articles.reduce((group, article) => {
    const year = getYear(new Date(article.created_time))
    const yearGroup = group.find(g => g.year === year)
    if (!yearGroup)
      group.push({
        year,
        articles: [article]
      })
    else {
      yearGroup.articles.push(article)
    }
    return group
  }, [] as { year: number, articles: any[] }[])

  return (
    <section className={ "mx-auto mt-12 max-w-article flex flex-col prose-hr:my-8 prose-h1:text-5xl" }>
      <header className="py-4">
        <h1>Articles</h1>
        <p>Articles that I wrote related to Next.js</p>
      </header>

      {
        yearGroup.map(group => (
          <div key={group.year} className="col items-stretch gap-0 divide-y divide-slate-600 info text-lg">
            <div className="py-4 text-2xl info tracking-tight font-light">{ group.year }</div>
            { group.articles.map(article => (
              <Link key={ article.id } href={ `/articles/${article.slug}` }
                className="row gap-3 py-6 leading-tight transition-all no-underline cursor-pointer"
              >
                <NotionIcon icon={ article.icon } />
                <div className="col gap-0.5">
                  <div className="title">{ article.flattenedTitle }</div>
                  <div className="row gap-2 text-sm">
                    <div className="body">{ (metadata.find(a => article.id === a.id)?.views ?? "0") + "  views" }</div>
                    <div className="info">{ format(new Date(article.created_time), "d MMM") }</div>
                  </div>
                </div>
              </Link>
            )) }
          </div>
        ))
      }



    </section>
  )

}
