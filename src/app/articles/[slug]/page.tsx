import { getArticles, notion } from "@/_lib/notion"
import { NotionASTNode, convertChildrenToAST } from "@/_lib/notion-to-ast"
import { JSONStringify } from "@/components/tool"
import { Code } from "bright"
import clsx from "clsx"
import { notFound } from "next/navigation"

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
    <JSONStringify data={ params.slug } />
    {/* {
      unknowns
    } */}
    <JSONStringify data={ unknowns } />
    <JSONStringify data={ ast } />
    <NotionASTRenderer node={ ast } />
    {/* <section>
      {
        (function mapChildren(node: Node): JSX.Element {
          if (node.type === 'root')
            return <></>
          if (node.type === 'h1')
            return (
              <h1 key={node.id}>
                { node.content?.map(t => t.plain_text ).join('') }
              </h1>
            )
          
          if (node.has_children) {
            return <>{ node.children.map( c => mapChildren(c) ) }</>
          }
          return <></>
        })(nodeTree)
      }
    </section> */}
  </>)
}


export const dynamicParams = false

function NotionASTRenderer(p: { node: NotionASTNode }) {
  return <>
    {
      p.node.children.map((e, i) => {
        console.log(e.type)
        const Component = NotionASTJSXMap[e.type] ?? 'div'

        if (e.children.length > 0) {
          if (e.type === 'paragraph') {
            return (
              <>
                <Component key={ i } node={ e }>
                  { e.content?.map(c => c.plain_text).join('') }
                </Component>
                <div className="pl-4">
                  <NotionASTRenderer node={ e } />
                </div>
              </>
            )
          }
          return (
            <Component key={ i } node={ e }>
              { e.content?.map(c => c.plain_text).join('') }
              <NotionASTRenderer node={ e } />
            </Component>
          )
        }
        else {
          return (
            <Component key={ i } node={ e }>
              { e.content?.map(c => c.plain_text).join('') }
            </Component>
          )
        }
      })
    }
  </>
}


const NotionASTJSXMap: {
  [key in NotionASTNode['type']]:
  (param: React.DetailedHTMLProps<React.HTMLAttributes<any>, any>
    &
  {
    node: NotionASTNode
  }) => React.ReactNode
} = {
  bulleted_list_item: ({ children, className, node, ...props }) => {
    return (
      <ul className={ clsx("", className) } { ...props }>
        <NotionASTRenderer node={ node } />
      </ul>
    )
  },
  numbered_list_item: ({ children, className, node, ...props }) => {
    return (
      <ol className={ clsx("", className) } { ...props }>
        <NotionASTRenderer node={ node } />
      </ol>
    )
  },
  list_item: ({ className, node, ...props }) => {
    return (
      <li className={ clsx("", className) } { ...props } />
    )
  },

  heading_1: ({ className, node, ...props }) => {
    return (<h1 className={ clsx("", className) } { ...props } />)
  },
  heading_2: ({ className, node, ...props }) => {
    return (<h2 className={ clsx("", className) } { ...props } />)
  },
  heading_3: ({ className, node, ...props }) => {
    return (<h3 className={ clsx("", className) } { ...props } />)
  },
  file: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  paragraph: ({ className, node, ...props }) => {
    return (<p className={ clsx("", className) } { ...props } />)
  },

  quote: ({ className, node, ...props }) => {
    return (<blockquote className={ clsx("", className) } { ...props } />)
  },
  to_do: ({ className, node, ...props }) => {
    return (<ul className={ clsx("", className) } { ...props } />)
  },
  toggle: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  template: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  synced_block: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  child_page: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  child_database: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  equation: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },

  code: ({ className, node, ...props }) => {
    return (
      <Code lang={node.props.language} theme="github-dark-dimmed">
        {node.content?.map(c => c.plain_text).join('') as any}  
      </Code>
    )
  },

  callout: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  divider: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  breadcrumb: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  table_of_contents: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  column_list: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  column: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  link_to_page: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  table: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  table_row: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  embed: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  bookmark: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  image: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  video: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  pdf: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  audio: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  link_preview: ({ className, node, ...props }) => {
    return (<a className={ clsx("", className) } { ...props } />)
  },
  unsupported: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  root: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },

}