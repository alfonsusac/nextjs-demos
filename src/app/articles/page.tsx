import Link from 'next/link'
import { cn } from "@/components/typography"
import { NotionIcon } from "@/components/notion/rsc/images"
import { TransformedPageData, getArticleList } from "@/components/notion/data/articles"
import supabase from '@/lib/supabase'
import { delay } from '@/lib/cache'

export const revalidate = 600 // 10 minutes

export default async function Articles() {



  const res = await supabase.from("Article").select("*")

  let articles = res.data?.map(a => a.data as TransformedPageData)
  let prodArticles = articles
  
  if (process.env.NODE_ENV === 'development') {
    console.log("Hello this is node_env dev")
    await delay(10000)
    articles = await getArticleList()
  }

  articles?.sort( (a, b) => parseInt(a.created_time) - parseInt(b.created_time) )
  return (
    <div className={ cn(
      "mx-auto mt-24",
      "prose-h1:text-5xl",
      "prose-hr:my-8",
      "max-w-article"
    ) }>
      <h1 className="mb-3">
        Articles
      </h1>
      <p>
        Articles that I wrote related to Next.js
      </p>
      <ul className="p-0 pt-12">
        {
          articles?.map(r => (
            <li key={ r.id } className="list-none m-0 transition-all group -my-2 sm:-mx-8">

              <Link
                href={ `/articles/${r.slug}` }
                className={ cn(
                  "block p-4 m-0 rounded-md hover:bg-slate-900/50 no-underline cursor-pointer",
                  "leading-tight",
                  "transition-all"
                ) }
              >

                <div className="flex gap-3">

                  <div className="w-5 h-5 text-lg">
                    <NotionIcon icon={ r.icon } />
                  </div>

                  <div>
                    <div className="font-semibold mt-1 group-hover:text-white transition-all">
                      { r.flattenedTitle }
                    </div>
                    <div className="text-xs text-slate-500">
                      { new Date(r.created_time).toDateString() }
                      <span className="pl-4">
                        { (res?.data?.find(a => r.id === a.id)?.views ?? "n/a" )+ " views" }
                      </span>
                    </div>
                  </div>

                </div>
              </Link>

            </li>
          ))
        }
      </ul>

    </div>
  )
}