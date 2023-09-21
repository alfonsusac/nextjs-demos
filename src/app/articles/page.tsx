import Link from 'next/link'
import { cn } from "@/components/typography"
import { NotionIcon } from "@/components/notion/rsc/images"
import { TransformedNotionPageData, getArticleList } from "@/components/notion/data/articles"
import supabase from '@/lib/supabase'
import { Suspense, cache } from 'react'
import { ArticleList_Error } from './client'
import { memoize } from 'nextjs-better-unstable-cache'
import { unstable_cache } from 'next/cache'

export const revalidate = 600 // 10 minutes

const getArticlesFromSupabase = memoize(
  async () => (await supabase.from("Article").select("*")).data ?? [],
  {
    duration: 3600,
    revalidateTags: ['articles']
  }
)

const cachedData = memoize(
  async () => Math.random().toPrecision(3),
  {
    duration: 20
  }
)
const cachedData2 = memoize(
  async () => Math.random().toPrecision(3),
  {
    duration: 5
  }
)

async function getRan() {
  return Math.random().toPrecision(3)
}

export default async function ArticlesPage({ searchParams }: any) {
  console.log("Article List Rendered")

  const getCachedRan1 = await unstable_cache(getRan, [], {revalidate: 20})()
  const getCachedRan2 = await unstable_cache(getRan, [], { revalidate: 5 })()
  const rng1 = (await (await fetch("https://random-data-api.com/api/v2/beers", {
    next: {
      tags: ['articles'],
      revalidate: 20
    }
  })).json()).id

  const rng2 = (await (await fetch("https://random-data-api.com/api/v2/beers", {
    next: {
      tags: ['articles'],
      revalidate:10
    }
  })).json()).id

  return (
    <div className="mx-auto mt-24   max-w-article   prose-hr:my-8   prose-h1:text-5xl  flex flex-col gap-12">

      <header>
        <h1>Articles</h1>
        <p>Articles that I wrote related to Next.js</p>
      </header>

      <div>
        { getCachedRan1 }
      </div>

      <div>
        { getCachedRan2 }
      </div>
      <div>
        { rng1 }
      </div>
      <div>
        { rng2 }
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