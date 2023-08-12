import { MdiCodeJson } from "@/components/code-snippet"
import { getFileSpans } from "@/components/code-snippet/util"
import { Toggle } from "@/components/notion/client"
import { getArticles, notion } from "@/components/notion/data"
import { NotionASTNode, convertChildrenToAST } from "@/components/notion/response-to-ast"
import { NotionCalloutIcon, NotionFigureCaption, NotionRichText, flattenRichText } from "@/components/notion/rsc"
import { CheckboxSVG, FileDownload } from "@/components/svg"
import { JSONStringify } from "@/components/tool"
import { Code } from "bright"
import clsx from "clsx"
import { notFound } from "next/navigation"
import 'katex/dist/katex.min.css'
import katex, { type KatexOptions, ParseError } from 'katex'
import Image from "next/image"
import { Document } from 'react-pdf'

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
    {/* {
      unknowns
    } */}
    <JSONStringify data={ params.slug } />

    <NotionASTRenderer node={ ast } />

    <JSONStringify data={ ast } />
    <JSONStringify data={ unknowns } />

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

  column_list: ({ className, node, ...props }) => {
    return (
      <div className={ clsx("grid grid-flow-col auto-cols-fr gap-x-4", className) } { ...props } />
    )
  },

  column: ({ className, node, ...props }) => {
    return (
      <div className={ clsx("w-full my-2", className) } { ...props } />
    )
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
  },




  bookmark: async ({ children, className, node, ...props }) => {
    const metadata = await getMetaInfo(node.props.url)
    return (
      <div className="my-2">
        <a
          target="_blank"
          href={ node.props.url }
          className={ clsx(
            "w-full flex flex-row rounded-md border border-zinc-800 no-underline"
            , "hover:bg-zinc-900/70"
            , className) } { ...props } >
          {/* {
            metadata.image ? (
              <div className="w-24">
                <img
                  src={ metadata.image }
                  alt="Metadata Image"
                />
              </div>
            ) : null
          } */}
          <div className="p-3 w-full flex flex-col">
            <div className="text-zinc-200 truncate w-full">
              { metadata.title }
            </div>
            {
              metadata.description ? (
                <div className="text-sm text-zinc-400 mt-1 mb-2 h-10 w-full line-clamp-2">
                  { metadata.description }
                </div>
              ) : null
            }
            <div className="text-sm text-zinc-500 flex flex-row gap-2">
              {
                metadata.faviconpath ? (
                  <div className="flex items-center">
                    <Image
                      unoptimized
                      width="16"
                      height="16"
                      src={ metadata.faviconpath }
                      alt="Link Icon URL"
                      className="w-4 h-4"
                    />
                  </div>
                ) : null
              }
              <div>
                { metadata.url ? metadata.url.host : node.props.url }
              </div>
            </div>
          </div>
          {/* <JSONStringify data={metadata.faviconpath} /> */ }
        </a>
        <NotionFigureCaption caption={ node.props.caption } />
      </div>
    )
  },
  image: ({ children, className, node, ...props }) => {
    const src = Object.hasOwn(node.props, 'external') ? node.props.external.url :
      Object.hasOwn(node.props, 'file') ? node.props.file.url : ''


    return (
      <div className={ clsx("my-2 relative w-full p-2", className) } { ...props }>

        {// eslint-disable-next-line @next/next/no-img-element
          <img
            src={ src }
            alt="a Picture"
            className="h-auto w-auto mx-auto rounded-md"
          />
        }

        <NotionFigureCaption caption={ node.props.caption } center/>
      </div>
    )
  },



  video: ({ children, className, node, ...props }) => {
    const external = node.props.type === 'external' ? node.props.external as { url: string } : undefined
    const file = node.props.type === 'file' ? node.props.file as { url: string, expiry_time: string } : undefined

    return (
      <div className={ clsx("my-2", className) } {...props}>
        {/* <JSONStringify data={ node.props } /> */}
        {
          external ? (
            <iframe 
              className="rounded-md mx-auto"
              width="560"
              height="315"
              src={external.url.replace('watch?v=', 'embed/')}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen>
            </iframe>
          ) : null
        }
        {
          file ? (
            <video
              controls 
              src={ file.url }
              className="rounded-md mx-auto"
            >
            </video>
          ) : null
        }
        <NotionFigureCaption caption={ node.props.caption } center/>
      </div>
    )
  },



  pdf: ({ className, node, ...props }) => {
    const external = node.props.type === 'external' ? node.props.external as { url: string } : undefined
    const file = node.props.type === 'file' ? node.props.file as { url: string, expiry_time: string } : undefined
    const url = external ? external.url : file ? file.url : undefined

    return (
      <div className="my-4 p-2">
        <embed
          className="max-h-[60vh] aspect-[6/7] w-full rounded-md"
          src={ url }
        />
        <NotionFigureCaption caption={ node.props.caption } />
      </div>
    )
  },


  audio: ({ children, className, node, ...props }) => {
    const file = Object.hasOwn(node.props, 'file') ? node.props.file : undefined
      
    return (
      <div className={ clsx("my-4 p-2", className) } { ...props }>
        {
          file ? (
            <audio src={ file.url } controls className="w-full" />
          ) : null
        }
        <NotionFigureCaption caption={ node.props.caption } />
      </div>
    )
  },


  file: async ({ children, className, node, ...props }) => {
    const external = node.props.type === 'external' ? node.props.external as { url: string } : undefined
    const file = node.props.type === 'file' ? node.props.file as { url: string, expiry_time: string } : undefined
    const url = external ? external.url : file ? file.url : undefined
    const filename = url ? await getFileName(url) : undefined
    const source = url?.includes('notion-static.com') ? 'notion-static.com' : filename?.url?.hostname

    return (
      <div className={ clsx("my-4 no-underline", className) } { ...props }>
        <a
          href={ url }
          target="_blank"
          download={filename}
          className="p-2 no-underline hover:bg-zinc-900 w-full rounded-md flex flex-row gap-1 items-end cursor-pointer">
          <FileDownload className="inline text-2xl" />
          <span className="text-zinc-200">
            { filename ? filename.title : "Unknown File Source" }
          </span>
          <span className="text-sm mx-2">
            ({source})
          </span>
        </a>
        {/* <JSONStringify data={ node } /> */}
        <NotionFigureCaption caption={ node.props.caption } className="mt-1" />
      </div>
    )
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








  embed: ({ children, className, node, ...props }) => {
    const url = node.props.url as string
    const spotify = url?.includes('open.spotify.com') ? url.replaceAll('/track/', '/embed/track/') : undefined
    const soundcloud = url?.includes('soundcloud.com') ? url : undefined
    
    return (
      <div className={ clsx("my-4 p-2 bg-black", className) } { ...props } >
        {
          spotify ? (
            <iframe
              className="bg-black rounded-xl"
              src={ spotify }
              width="100%"
              height="152"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            >
            </iframe>
          ) : null
        }
        {
          soundcloud ? (
            <>
              <iframe
                width="100%"
                height="166"
                allow="autoplay"
                src={"https://w.soundcloud.com/player/?url=" + encodeURIComponent(soundcloud)}>
              </iframe>
            </>
          ) : null
        }
        <NotionFigureCaption caption={ node.props.caption } center />
      </div>
    )
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
import { getFileName, getMetaInfo } from "@/components/metadata/util"

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