import { getArticles } from "@/components/notion/data"
import { Page } from "../client"
import { Category, dirs } from "../layout"
import Link from 'next/link'
import { cn } from "@/components/typography"
import { NotionIcon } from "@/components/notion/rsc/rich-text"

export default async function Articles() {

  const articles = await getArticles()


  return (
    <article className="mx-auto">

      <h1 className="mb-4">
        Articles
      </h1>
      
      <ul className="p-0">
        {
          articles.map(r => (
            <li key={ r.id } className="list-none m-0 transition-all group -my-2 sm:-mx-8">

              <Link
                href={ `/articles/${r.slug}` }
                className={ cn(
                  // "border border-zinc-600 mb-2",
                  "block p-4 m-0 rounded-md hover:bg-zinc-900/50 no-underline cursor-pointer",
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
                    <div className="text-xs text-zinc-500">
                      { new Date(r.last_edited_time).toDateString() }
                    </div>
                  </div>

                </div>
              </Link>

            </li>
          ))
        }
      </ul>

    </article>
  )
}