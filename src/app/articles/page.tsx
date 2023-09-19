import Link from 'next/link'
import { cn } from "@/components/typography"
import { NotionIcon } from "@/components/notion/rsc/images"
import { TransformedNotionPageData, getArticleList } from "@/components/notion/data/articles"
import supabase from '@/lib/supabase'
import { delay } from '@/lib/cache'
import { ErrorBoundary, ErrorBoundaryProps, FallbackProps } from 'react-error-boundary'
import { Suspense } from 'react'
import { JSONStringify } from '@/components/tool'
import { ArticleList_Error } from './client'
import { memoize } from 'nextjs-better-unstable-cache'
import { convertObjectArraytoMap } from '@/lib/utils'

export const revalidate = 600 // 10 minutes

const getArticlesFromSupabase = memoize(
  async () => (await supabase.from("Article").select("*")).data ?? [],
  {
    duration: 3600,
    revalidateTags: ['articles']
  }
)

export default async function ArticlesPage() {
  console.log("Article List Rendered")

  const res = await fetch("https://random-data-api.com/api/v2/beers", {
    cache: 'force-cache',
    next: {
      tags: ['articles']
    }
  })
  const data = (await res.json()).id as number

  return (
    <div className="mx-auto mt-24   max-w-article   prose-hr:my-8   prose-h1:text-5xl  flex flex-col gap-12">

      <header>
        <h1>Articles</h1>
        <p>Articles that I wrote related to Next.js</p>
      </header>

      <div>
        {Math.random().toPrecision(3)}
      </div>

      <div>
        { data }
      </div>

      <ArticleList_Error>
        <Suspense fallback={ <div className="text-sm text-slate-500"> Loading Articles... </div> }>
          <ArticleList />
        </Suspense>
      </ArticleList_Error>

    </div>
  )
}

async function ArticleList() {
  // await get article list
  const list = await memoize(getArticleList, { revalidateTags: ['articles'] })()
  return (
    <ul>
      { list.map(article => <ListItem key={ article.id } article={ article } />) }
    </ul>
  )
}

async function ListItem({ article }: {
  article: TransformedNotionPageData,
}) {
  const metadata = await getArticlesFromSupabase()
  const Title = "div"
  const Metadata = "div"
  return (
    <li key={ article.id } className="list-none m-0 transition-all group -my-2 sm:-mx-8">
      <Link
        href={ `/articles/${article.slug}` }
        className={ cn(
          "block p-4 m-0 rounded-md hover:bg-slate-900/50 no-underline cursor-pointer",
          "leading-tight",
          "transition-all"
        ) }
      >
        <div className="flex gap-3">
          {/* LEFT */}
          <div className="w-5 h-5 text-lg">
            <NotionIcon icon={ article.icon } />
          </div>
          {/* RIGHT */}
          <div>
            <Title className="font-semibold mt-1 group-hover:text-white transition-all">
              { article.flattenedTitle }
            </Title>
            <Metadata className="text-xs text-slate-500">
              { new Date(article.created_time).toDateString() }
              <span className="pl-4">
                { (metadata.find(a => article.id === a.id)?.views ?? "0") + " views" }
              </span>
            </Metadata>
          </div>
        </div>
      </Link>
    </li>
  )
}