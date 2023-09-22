import { NotionIcon } from "@/components/notion/rsc/images"
import { Data } from "@/lib/data"
import { Procedure } from "@/lib/procedures"
import { format } from "date-fns"
import Link from "next/link"
import { memoize } from "nextjs-better-unstable-cache"


export default async function ArticleListPage() {

  const [articles, metadata] = await Procedure.parallel([
    Procedure.prefetchForStatic(Data.getArticleList, []),
    Procedure.prefetchForStatic(Data.getArticleListMetadata, [])
  ])

  return (
    <section className={ "mx-auto mt-12 max-w-article flex flex-col prose-hr:my-8 prose-h1:text-5xl divide-y divide-slate-600" }>
      <header className="py-4">
        <h1>Articles</h1>
        <p>Articles that I wrote related to Next.js</p>
      </header>

      {/* <div className="col gap-12"> */}
        { articles.map(article => (
          <Link key={ article.id } href={ `/articles/${article.slug}` }
            className="row gap-3 py-6 leading-tight transition-all no-underline cursor-pointer"
          >
            <NotionIcon icon={ article.icon } />
            <div className="col gap-0.5">
              <div className="title">{ article.flattenedTitle }</div>
              <div className="row gap-2 text-sm">
                <div className="description">{ (metadata.find(a => article.id === a.id)?.views ?? "0") + "  views" }</div>
                <div className="info">{ format(new Date(article.created_time), "dd/mm/yyyy") }</div>
              </div>
            </div>
          </Link>
        )) }
      {/* </div> */}

    </section>
  )

}
