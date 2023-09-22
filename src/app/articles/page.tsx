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
    <section className={"mx-auto mt-24 max-w-article flex flex-col gap-12 prose-hr:my-8 prose-h1:text-5xl"}>
      <header>
        <h1>Articles</h1>
        <p>Articles that I wrote related to Next.js</p>
      </header>

      <div>
        { articles.map(article => (
          <Link key={ article.id } href={ `/articles/${article.slug}` }
            className="row gap-3 py-4 leading-tight transition-all rounded-md no-underline cursor-pointer"
          >
              <NotionIcon icon={ article.icon } />
            <div className="col">
              <div className="title">{ article.flattenedTitle }</div>
              <div className="row gap-2">
                <div className="description">{ (metadata.find(a => article.id === a.id)?.views ?? "0") +"  views" }</div>
                <div className="info">{ format(new Date(article.created_time),"dd/mm/yyyy")  }</div>
              </div>
            </div>
          </Link>
        ) ) }
      </div>

    </section>
  )

}
