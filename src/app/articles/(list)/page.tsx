import Link from 'next/link'
import { cn } from "@/components/typography"
import { NotionIcon } from "@/components/notion/rsc/images"
import { TransformedNotionPageData, getArticleList } from "@/data/articles"
import supabase from '@/lib/supabase'
import { Suspense } from 'react'
import { ArticleList_Error } from '../client'
import { memoize } from 'nextjs-better-unstable-cache'

export default async function ArticlesPage() {
  console.log("Article List Rendered")
  
  return <ArticleList />
}


const getArticlesFromSupabase = memoize(
  async () => (await supabase.from("Article").select("*")).data ?? [],
  {
    duration: 3600,
    revalidateTags: ['articles']
  }
)

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
  const metadata = await getArticlesFromSupabase() // 3600 
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
          {/* LEFT */ }
          <div className="w-5 h-5 text-lg">
            <NotionIcon icon={ article.icon } />
          </div>
          {/* RIGHT */ }
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