import { getArticles, notion } from "@/components/notion/data"
import { NodeTypes, NotionASTNode, convertChildrenToAST } from "@/components/notion/response-to-ast"
import clsx from "clsx"
import { notFound } from "next/navigation"
import 'katex/dist/katex.min.css'
import NotionASTRenderer from "@/components/notion/rsc/notion-ast-renderer"

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

  const { ast, unknowns } = await convertChildrenToAST(await notion.blocks.children.list({
    block_id: article.id,
    page_size: 1000,
  }))

  console.info("Done generating page!")

  return (<>
    <NotionASTRenderer node={ ast } />
  </>)
}


export const dynamicParams = false