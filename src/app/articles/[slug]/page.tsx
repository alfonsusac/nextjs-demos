import 'katex/dist/katex.min.css'
import { cn } from "@/components/typography"
import { Sidebar } from "@/app/demos/layout"
import { ToCSidebar } from "@/components/toc/client"
import { CommentSection } from "@/components/giscus"
import { NotionIcon, NotionImage } from "@/components/notion/rsc/images"
import Link from "next/link"
import { NotionRichText } from "@/components/notion/rsc/rich-texts/parser"
import { formatDistanceToNow } from "date-fns"
import { InlineMentionTooltip } from "@/components/notion/client"
import { NotionPageViews } from "./page.client"
import { Audit, audit, clearLog } from '@/components/timer'
import supabase from '@/lib/supabase'
import { NotionASTRenderer } from '@/components/notion/rsc/notion-ast-renderer-2'
import { getCachedPageDetails, getCachedPageMetadata } from './page.data'

// ! Server action not working yet in static routes.
// export const dynamicParams = false
// export const dynamic = 'error'
// export async function generateStaticParams() {
//   const articles = await getArticleList()
//   const params = articles.map(({ slug }) => {
//     return { slug }
//   })
//   return params
// }

export async function generateMetadata({ params }: any) {
  const { article } = await getCachedPageDetails(params.slug)
  return {
    title: article.flattenedTitle,
    description: "Next.js Notes, Tips and Tricks - by @alfonsusac",
  }
}

export default async function Page({ params }: any) {

  clearLog()
  const timer = new Audit("Generating Page", false)

  const { article, ast, headings } = await getCachedPageDetails(params.slug) // On-Demand Revalidation
  const metadata = await getCachedPageMetadata(article.id) // revalidate: 3600

  timer.total()

  return (
    <>
      <PageCover />
      <div className="flex gap-4 mx-auto">

        {/* LEFT */ }
        <article className="max-w-article m-0 w-full mx-auto md:mr-0">
          <Header />
          <NotionASTRenderer ast={ ast } />
          <CommentSection />
          <footer className="mt-12 py-12 border-t border-t-slate-600 text-slate-500 text-sm space-y-2 leading-normal">
            <FooterContent />
          </footer>
        </article>

        {/* RIGHT */ }
        <div className={ cn(
          'hidden md:block',
          'sticky top-20',
          'w-56 h-full',
          'mt-32',
        ) }>
          In this article
          <Sidebar>
            <li>
              <ToCSidebar
                startDepth={ 1 }
                depth={ 3 }
                className=""
                listClassName="text-sm"
                items={ headings }
              />
            </li>
          </Sidebar>
        </div>
      </div>
    </>
  )

  function PageCover() {
    return (
      <>
        <NotionImage
          alt="Page Cover"
          nprop={ article.cover as any }
          className={ cn(
            "w-full h-60 object-cover",
            "after:bg-gradient-to-t after:from-slate-800 after:to-transparent",
            "absolute",
            "top-0 left-0 right-0 m-0",
            "max-w-none flex"
          ) }
          id={ article.id }
        />
        {
          article.cover ? <div className="h-40 w-0 flex-grow"></div> : null
        }
      </>
    )
  }

  function Header() {
    return (
      <header className="my-8 mt-8 space-y-2 relative">
        <NotionIcon icon={ article.icon }
          className="text-5xl m-0 block w-12 h-12 mb-4"
        />
        <Link
          className="text-sm p-2 rounded-md text-slate-400 hover:bg-slate-900 decoration-slate-600 underline-offset-4 -mx-2"
          href="/articles"
        >
          /articles
        </Link>

        {/* TITLE */ }
        <h1 className="py-2 pb-4">
          <NotionRichText rich_text={ article.title } />
        </h1>

        {/* METADATA */ }
        <div className="text-sm text-slate-500 flex flex-row gap-4 flex-wrap items-center">
          <InlineMentionTooltip content={ (new Date(article.last_edited_time)).toLocaleString() }>
            <span className="ml-1 rounded-md p-1 hover:bg-slate-900/80">
              { '@' + formatDistanceToNow(new Date(article.last_edited_time), { addSuffix: true }) }
            </span>
          </InlineMentionTooltip>
          <NotionPageViews cachedNum={ metadata.views }
            onLoadView={ async () => {
              'use server'
              if(process.env.NODE_ENV === 'production')
                await supabase.rpc('incrementpageview', { row_id: article.id })
            } }
          />
        </div>

      </header>
    )
  }
}


function PageViews() {

}

function FooterContent() {
  return (
    <>
      <p>
        The content on this website are purely written by Alfon to help people better understand how Next.js works and are not affiliated with Vercel (unofficial).
      </p>
      <p>
        If you have any comments for improvement on the website or the content feel free to visit <a href="https://github.com/alfonsusac/nextjs-demos/issues">the respository</a> which is 100% open source.
      </p>
      <p>
        Written by <a href="https://github.com/alfonsusac">@alfonsusac</a>
      </p>
    </>
  )
}