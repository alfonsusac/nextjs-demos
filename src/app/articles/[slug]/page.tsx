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
import { NotionASTRenderer } from '@/components/notion/rsc/notion-ast-renderer'
import { getCachedPageDetails, getPageData } from './page.data'
import { getArticle } from '@/components/notion/data/articles'
import { getPageContent } from '@/components/notion/data/helper'
import { convertChildrenToAST } from '@/components/notion/parser/parser'
import { extractHeadings } from '@/components/notion/notion-toc/rsc'
import { notFound } from 'next/navigation'
import { Prisma } from '@prisma/client'

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
  const res = await getPageData(params.slug) // 3600 BGR
  if (!res) notFound()
  const {
    article,
  } = res
  return {
    title: article.flattenedTitle,
    description: "Next.js Notes, Tips and Tricks - by @alfonsusac",
  }
}

export default async function Page({ params }: any) {

  clearLog()
  const timer = new Audit("Generating Page", false)

  // 1. Generate Page on Local
  // 2. Check if data exist -> notFound() if not
  
  // LOCAL MACHINE ONLY
  if (process.env.NODE_ENV === 'development') {
    const article = await getArticle(params.slug)
    const content = await getPageContent(article.id)
    const ast = await convertChildrenToAST(content)

    // Add if not exist, edit if exist.
    await supabase.from('Article').upsert({
      id: article.id,
      slug: params.slug,
      content: JSON.parse(JSON.stringify(ast)) as Prisma.JsonObject,
      data: article as Prisma.JsonObject
    })
  }

  // Fetch article data from supabase
  const res = await getPageData(params.slug) // 3600 BGR
  if(!res) notFound()
  const {
    id: pageID,
    article,
    ast,
    views
  } = res
  const headings = extractHeadings(ast)


  // const { article, ast, headings } = await getCachedPageDetails(params.slug) // On-Demand Revalidation
  // const metadata = await getCachedPageMetadata(pageID) // revalidate: 3600

  timer.total()
  return (
    <>
      <NotionImage id={ pageID } nprop={ article.cover as any }
        alt="Page Cover"
        className="object-cover    w-full h-60    overflow-hidden    absolute    top-0 left-0 right-0 m-0"
      />
      { article.cover && <div className="h-40 w-0 flex-grow" /> }

      {/* WRAPPER */ }
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


  function Header() {
    return (
      <header className="py-8 pb-12 space-y-2 relative">
        <NotionIcon icon={ article.icon } className="text-5xl m-0 block w-12 h-12 mb-4"/>
        <Link className="text-sm p-2 rounded-md text-slate-400 hover:bg-slate-900 decoration-slate-600 underline-offset-4 -mx-2"
          href="/articles"
        >
          /articles
        </Link>

        {/* TITLE */ }
        <h1 className="py-2 pb-2">
          <NotionRichText rich_text={ article.title } />
        </h1>

        {/* METADATA */ }
        <div className="text-sm text-slate-500 flex flex-row gap-3 flex-wrap items-center">

          <InlineMentionTooltip content={ (new Date(article.last_edited_time)).toLocaleString() }>
            <span className="ml-1 rounded-md p-1 px-2 -translate-x-2 hover:bg-slate-900/80">
              { '@' + formatDistanceToNow(new Date(article.last_edited_time), { addSuffix: true }) }
            </span>
          </InlineMentionTooltip>

          <NotionPageViews cachedNum={ views }
            onLoadView={ async () => {
              'use server'
              if (process.env.NODE_ENV === 'production')
                await supabase.rpc('incrementpageview', { row_id: article.id })
            } }
          />

        </div>

      </header>
    )
  }
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