import { getArticles, getPageContent } from "@/components/notion/data"
import { notFound } from "next/navigation"
import 'katex/dist/katex.min.css'
import { RenderNotionPage } from "@/components/notion/rsc/notion-ast-renderer"
import { NotionIcon, NotionImage, NotionRichText } from "@/components/notion/rsc/rich-text"
import { formatRelative } from "date-fns"
import { cn } from "@/components/typography"

export async function generateStaticParams() {
  const articles = await getArticles()
  const params = articles.map(({ slug }) => {
    return { slug }
  })
  return params
}


export default async function Page({ params }: any) {

  const articles = await getArticles()

  const article = articles.find(r => r.slug === params.slug)
  if (!article) notFound()

  const content = await getPageContent(article.id)

  console.info("Done generating page!")

  return (
    <>
      <NotionImage
        alt="Page Cover"
        nprop={ article.cover as any }
        className={ cn(
          "w-full h-60 object-cover after:bg-gradient-to-t after:from-zinc-800 after:to-transparent",
          "absolute",
          "top-0 left-0 right-0 m-0",
          "max-w-none"
        ) }
      />
      <>
        
        <div className="h-36">

        </div>

        <header className="my-8 mt-8 space-y-2 relative">
          <NotionIcon icon={ article.icon }
            className="text-6xl m-2 absolute -mt-20"
          />


          <h1 className="">
            <NotionRichText rich_text={ article.title } />
          </h1>

          <div className="text-sm text-zinc-500">
            Last updated: { formatRelative(new Date(article.last_edited_time), new Date()) }
          </div>

        </header>

        <RenderNotionPage data={ content } />

      </>
    </>
  )
}


export const dynamicParams = false