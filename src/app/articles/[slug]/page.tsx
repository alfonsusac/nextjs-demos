import 'katex/dist/katex.min.css'
// import { InputComponents, NotionASTRenderer } from "@/components/notion/rsc/notion-ast-renderer"
import { cn } from "@/components/typography"
import { Sidebar } from "@/app/demos/layout"
import { ToCSidebar } from "@/components/toc/client"
import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints"
import { convertChildrenToAST } from "@/components/notion/parser/parser"
import { UseAsTOCContentClient } from "@/components/toc/context"
import { extractHeadings } from "@/components/notion/notion-toc/rsc"
import { CommentSection } from "@/components/giscus"
import { NotionIcon, NotionImage } from "@/components/notion/rsc/images"
import Link from "next/link"
import { NotionRichText } from "@/components/notion/rsc/rich-text"
import { formatDistanceToNow } from "date-fns"
import { InlineMentionTooltip } from "@/components/notion/client"
import { NotionPageViews } from "./client"
import { getArticle } from "@/components/notion/data/articles"
import { getPageContent } from "@/components/notion/data/helper"
import { unstable_cache } from 'next/cache'
// import { getAndAddViewCount } from '@/components/notion/data/metadata'
import prisma from '@/lib/prisma'
import { NotionASTRenderer } from '@/components/notion/rsc/notion-ast-renderer-2'

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

export default async function Page({ params }: any) {

  console.log("A")

  const {
    article,
    content
  } = await unstable_cache(
    async () => {
      const article = (await getArticle(params.slug))!
      const content = await getPageContent(article.id)
      return { article, content }
    },
    [params.slug], // basically like dependency array. Required.
    {
      tags: ['articles', params.slug]
    }
  )()


  const ast = await convertChildrenToAST(content)
  const headings = extractHeadings(ast)
  
  let metadata = await prisma.article.findUnique({
    where: {
      id: article.id,
    },
    select: {
      views: true
    }
  })
  if (!metadata) {
    metadata = await prisma.article.create({
      data: {
        id: article.id,
        views: 0
      }
    })
  } 

  console.log("B")

  // const article = (await getArticle(params.slug))!
  // const content = await getPageContent(article.id)
  // const ast = await convertChildrenToAST(content)
  // const headings = extractHeadings(ast)

  console.info("Done generating page!")

  return (
    <>
      <NotionImage
        alt="Page Cover"
        nprop={ article.cover as any }
        className={ cn(
          "w-full h-60 object-cover",
          "after:bg-gradient-to-t after:from-zinc-800 after:to-transparent",
          "absolute",
          "top-0 left-0 right-0 m-0",
          "max-w-none flex"
        ) }
      />
      {
        article.cover ? <div className="h-40 w-0 flex-grow"></div> : null
      }
      <div className="flex gap-4 mx-auto">


        {/* LEFT */ }
        <article className="max-w-article m-0 w-full mx-auto md:mr-0">
          <header className="my-8 mt-8 space-y-2 relative">

            <NotionIcon icon={ article.icon }
              className="text-5xl m-0 block w-12 h-12 mb-4"
            />

            <Link
              className="text-sm p-2 rounded-md text-zinc-400 hover:bg-zinc-900 decoration-zinc-600 underline-offset-4 -mx-2"
              href="/articles"
            >
              /articles
            </Link>


            <h1>
              <NotionRichText rich_text={ article.title } />
            </h1>

            <div className="text-sm text-zinc-500">

              Last updated:
              <InlineMentionTooltip
                content={
                  (new Date(article.last_edited_time)).toLocaleString()
                }
              >
                <span className="ml-1 rounded-md p-1 hover:bg-zinc-900/80">
                  { '@' + formatDistanceToNow(new Date(article.last_edited_time), { addSuffix: true }) }
                </span>
              </InlineMentionTooltip>

              { ` ● ` }

              <NotionPageViews
                id={ article.id }
                num={ metadata.views }
                loadView={
                  async (id) => {
                    'use server'
                    await prisma.article.update({
                      where: { id: article.id },
                      data: { views:{ increment: 1 }}
                    })
                  }
                }
              />

            </div>

          </header>

          {/* <RenderNotionPage
            data={ content }
          /> */}

          {/* <UseAsTOCContentClient headings={ headings }>
            <NotionASTRenderer ast={ ast } />
          </UseAsTOCContentClient> */}

          <NotionASTRenderer ast={ ast } />

          <CommentSection />



          <footer className="mt-12 py-12 border-t border-t-zinc-600 text-zinc-500 text-sm space-y-2 leading-normal">
            <p>
              The content on this website are purely written by Alfon to help people better understand how Next.js works and are not affiliated with Vercel (unofficial).
            </p>
            <p>
              If you have any comments for improvement on the website or the content feel free to visit <a href="https://github.com/alfonsusac/nextjs-demos/issues">the respository</a> which is 100% open source.
            </p>
            <p>
              Written by <a href="https://github.com/alfonsusac">@alfonsusac</a>
            </p>
          </footer>
        </article>



        {/* RIGHT */ }
        <div className={ cn(
          'hidden md:block',
          'sticky',
          'top-40',
          'w-56',
          'h-full',
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
}



// async function RenderNotionPage(p: {
//   data: ListBlockChildrenResponse
//   components?: InputComponents
// }) {
//   const ast = await convertChildrenToAST(p.data)
//   const headings = extractHeadings(ast)

//   return (
//     <UseAsTOCContentClient headings={ headings }>
//       <NotionASTRenderer node={ ast } components={ p.components } />
//     </UseAsTOCContentClient>
//   )
// } 