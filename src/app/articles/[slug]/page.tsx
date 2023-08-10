import { MdiCodeJson } from "@/components/code-snippet"
import { getFileSpans } from "@/components/code-snippet/utilt"
import { Toggle } from "@/components/notion/client"
import { getArticles, notion } from "@/components/notion/data"
import { NotionASTNode, convertChildrenToAST } from "@/components/notion/response-to-ast"
import { NotionCalloutIcon, NotionRichText, flattenRichText } from "@/components/notion/rsc"
import { CheckboxSVG } from "@/components/svg"
import { JSONStringify } from "@/components/tool"
import { Code } from "bright"
import clsx from "clsx"
import { notFound } from "next/navigation"
import 'katex/dist/katex.min.css'
// import TeX from '@matejmazur/react-katex';
import katex, { type KatexOptions, ParseError } from 'katex'

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

        return (
          <Component key={ i } node={ e }>
            {
              e.children ? <NotionASTRenderer node={ e } /> : null
            }
          </Component>
        )
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
  to_do: ({ children, className, node, ...props }) => {
    return (
      <ul className={ clsx("", className) } { ...props }>
        { children }
      </ul>
    )
  },
  list_item: ({ children, className, node, ...props }) => {
    if (
      'checked' in node.props
    ) {
      return (
        <li className={ clsx("list-none ml-0", className) } { ...props }>
          <CheckboxSVG
            checked={ node.props.checked }
            className="inline w-8 h-6 my-auto mb-1" />
          <NotionRichText rich_text={ node.content! } />
          {
            node.children ? (
              <div className="">
                { children }
              </div>
            ) : null
          }
        </li>
      )
    } else {
      return (
        <li className={ clsx("", className) } { ...props }>

          <NotionRichText rich_text={ node.content! } />
          {
            node.children ? (
              <div className="">
                { children }
              </div>
            ) : null
          }
        </li>
      )
    }
  },




  heading_1: ({ children, className, node, ...props }) => {
    return (
      <h1 className={ clsx("", className) } { ...props } >
        <NotionRichText rich_text={ node.content! } />
      </h1>
    )
  },
  heading_2: ({ children, className, node, ...props }) => {
    return (
      <h2 className={ clsx("", className) } { ...props }>
        <NotionRichText rich_text={ node.content! } />
      </h2>
    )
  },
  heading_3: ({ className, node, ...props }) => {
    return (
      <h3 className={ clsx("", className) } { ...props } >
        <NotionRichText rich_text={ node.content! } />
      </h3>
    )
  },





  paragraph: ({ children, className, node, ...props }) => {
    return (
      <>
        <p className={ clsx("m-0", className) } { ...props }>
          <NotionRichText rich_text={ node.content! } />
        </p>
        {
          node.children ? (
            <div className="pl-4">
              { children }
            </div>
          ) : null
        }
      </>
    )
  },

  code: ({ className, node, ...props }) => {
    return (
      <Code
        lang={ node.props.language }
        theme="one-dark-pro"
        title={ flattenRichText(node.props.caption) }
        className='border border-zinc-800 rounded-lg my-4 relative w-full bg-black'
        codeClassName='p-0 -mt-1'
        extensions={ [
          {
            name: 'titleBar',
            TitleBarContent(props) {
              const { title, colors, theme } = props
              const { editor, background } = colors
              const textspans = getFileSpans(title ?? '')
              return (
                <label
                  className="p-3 text-xs text-zinc-400 px-4 flex justify-between bg-black w-full"
                  htmlFor={ title }
                >
                  <div className="flex gap-1">
                    <MdiCodeJson className="h-full mr-2" />
                    {
                      textspans.map((t, i) =>
                        t === '/' ?
                          <span key={ i }>/</span> :
                          <span key={ i }>{ t }</span>
                      )
                    }
                  </div>
                </label>
              )
            }
          },
        ] }

      >
        { node.content?.map(c => c.plain_text).join('') as any }
      </Code>
    )
  },


  toggle: ({ children, className, node, ...props }) => {
    return (
      <Toggle headerSlot={
        <NotionRichText rich_text={ node.content! } />
      }>
        <div className="pl-4">
          { children }
        </div>
      </Toggle>
    )
  },


  quote: ({ children, className, node, ...props }) => {
    return (
      <blockquote className={ clsx("", className) } { ...props }>
        <NotionRichText rich_text={ node.content! } />
        {
          node.children ? (
            <div className="">
              { children }
            </div>
          ) : null
        }
      </blockquote>
    )
  },
  divider: ({ children, className, node, ...props }) => {
    return (<hr className={ clsx("", className) } { ...props } />)
  },


  equation: ({ children, className, node, ...props }) => {
    return (
      <TeXRSC
        settings={ {

        } }
        className="py-2 hover:bg-zinc-900"
        math={ node.props.expression }
        block
      />
    )
  },



  callout: ({ children, className, node, ...props }) => {
    return (
      <div className={ clsx("flex gap-4 p-4 bg-zinc-900 rounded-md border-zinc-800 my-2", className) } { ...props } >
        <NotionCalloutIcon icon={ node.props.icon } />
        <div>
          <NotionRichText rich_text={ node.content! } />
          { children }
        </div>
      </div>
    )
  },

  column: ({ className, node, ...props }) => {
    return (
      <div className={ clsx("w-full my-2", className) } { ...props } />
    )
  },
  column_list: ({ className, node, ...props }) => {
    return (<div className={ clsx("flex flex-row gap-2", className) } { ...props } />)
  },





  table: ({ children, className, node, ...props }) => {
    const { has_row_header, has_column_header } = node.props

    const [headRow, ...rest] = node.children

    return (
      <table className={ clsx("my-3 bg-zinc-900/70", className) } { ...props }>
        {
          has_row_header === true ? (
            <thead>
              <tr>
                {
                  node.children[0].props.cells.map((c: RichTextItemResponse[], i: number) => {
                    return (
                      <th scope="row" key={ i } className="border border-zinc-800 p-2 px-2.5 bg-black">
                        <NotionRichText rich_text={ c! } />
                      </th>
                    )
                  })
                }
              </tr>
            </thead>
          ) : null
        }
        <tbody>
          {
            (has_row_header ? rest : node.children).map((c, i) => {
              return (
                <tr key={ i }>
                  {
                    c.props.cells.map((c: RichTextItemResponse[], i: number) => {
                      if (has_column_header && i === 0) {
                        return (
                          <th scope="col" key={ i } className="border border-zinc-800 p-2 px-2.5 bg-black">
                            <NotionRichText rich_text={ c! } />
                          </th>
                        )
                      } else
                        return (
                          <td key={ i } className="border border-zinc-800 p-2 px-2.5">
                            <NotionRichText rich_text={ c! } />
                          </td>
                        )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  },
  table_row: ({ className, node, ...props }) => {
    return (
      <tr className={ clsx("", className) } { ...props }>
        {
          node.props.cells.map((cell: RichTextItemResponse[], i: number) => {
            return (
              <td key={ i } className="border border-zinc-800 p-1.5 px-2.5">
                <NotionRichText rich_text={ cell! } />
              </td>
            )
          })
        }
      </tr>
    )
    return (
      <div className={ clsx("", className) } { ...props } />
    )
  },


  file: ({ className, node, ...props }) => {
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


  template: ({ className, node, ...props }) => {
    return (<></>)
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
  breadcrumb: ({ className, node, ...props }) => {
    return (<></>)
  },
  table_of_contents: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },
  link_to_page: ({ className, node, ...props }) => {
    return (<div className={ clsx("", className) } { ...props } />)
  },








  embed: ({ className, node, ...props }) => {
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


//https://gist.github.com/filipesmedeiros/c10b3065e20c4d61ba746ab78c6a7a9e

import { type ComponentProps, type ReactElement } from 'react'
import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"

export type Props<T extends keyof JSX.IntrinsicElements = 'div'> =
  ComponentProps<T> &
  Partial<{
    as: T
    block: boolean
    errorColor: string
    renderError: (error: ParseError | TypeError) => ReactElement
    settings: KatexOptions
  }> & {
    math: string
  }

async function TeXRSC({
  children,
  math,
  block,
  errorColor,
  renderError,
  settings,
  as: asComponent,
  ...props
}: Props) {
  // @ts-expect-error CSS not JS
  await import('katex/dist/katex.min.css')

  const Component = asComponent || (block ? 'div' : 'span')
  const content = (children ?? math) as string

  let innerHtml: string
  try {
    innerHtml = katex.renderToString(content, {
      displayMode: !!block,
      errorColor,
      throwOnError: !!renderError,
      ...settings,
    })
  } catch (error) {
    if (error instanceof ParseError || error instanceof TypeError) {
      if (renderError) {
        return renderError(error)
      } else {
        innerHtml = error.message
      }
    } else {
      throw error
    }
  }

  return (
    <Component { ...props } dangerouslySetInnerHTML={ { __html: innerHtml } } />
  )
}