import { NotionFigureCaption, NotionRichText, flattenRichText, ApiColor, convertColorToClassname } from "./rich-text"
import clsx from "clsx"
import { CheckboxSVG, FileDownloadIcon } from "@/components/svg"
import { Toggle } from "../client"
import { CodeRSC } from "@/components/code-snippet/rsc"
import { KaTeXRSC } from "@/components/katex/rsc"
import { getFileName, getMetaInfo } from "@/components/metadata/util"
import Image from "next/image"
import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints"
import { cn } from "@/components/typography"
import { NotionIcon, NotionImage } from "./images"
import { slug } from "github-slugger"
import { NodeTypes } from "../types"
import { convertChildrenToAST } from "../parser/parser"
import { NotionASTNode } from "../parser/node"

type NotionASTComponentMap = {
  [key in NotionASTNode['type']]:
  (
    param: React.DetailedHTMLProps<React.HTMLAttributes<any>, any> &
    { node: NodeTypes[key] }
  ) => React.ReactNode
}

export type InputComponents = (
  comps: {
    RichText: React.ReactNode
    Caption: React.ReactNode
    flattenedRichText?: string
    flattenedCaption?: string
  }
) => Partial<NotionASTComponentMap>

export async function RenderNotionPage(p: {
  data: ListBlockChildrenResponse
  components?: InputComponents
}) {
  const ast = await convertChildrenToAST(p.data)
  return (
    <NotionASTRenderer node={ ast } components={ p.components } />
  )
}



export function NotionASTRenderer(p: {
  node: NotionASTNode,
  components?: InputComponents
  onRender?: (node: NotionASTNode) => void
}) {

  return p.node.children.map((e, i) => {


    const Component = getComponent({
      node: e,
      params: p.components
    })

    return (
      <Component key={ i } node={ e as never }>
        {
          e.children ? (
            <NotionASTRenderer
              node={ e }
              components={ p.components }
            />
          ) : null
        }
      </Component>
    )
  })
}

function getComponent({ node, params }: {
  node: NotionASTNode,
  params?: InputComponents,
}) {

  const RichText = () => node.content ?
    <NotionRichText rich_text={ node.content } /> : null
  const flattenedRichText = node.raw_content

  const Caption = ({ ...rest }: Omit<React.ComponentProps<typeof NotionFigureCaption>, 'caption'>) => node.props.caption ?
    <NotionFigureCaption caption={ node.props.caption } { ...rest } /> : null
  const flattenedCaption = node.props.caption && flattenRichText(node.props.caption)

  const slugid = flattenedRichText ? slug(flattenedRichText) : undefined

  if (params) {
    const customComponent = params({
      RichText: <RichText />,
      Caption: <Caption />,
      flattenedCaption,
      flattenedRichText,
    })
    if (node.type in customComponent) {
      return customComponent[node.type]!
    }
  }
  return DefaultComponent


  async function DefaultComponent({ children, className, node, ...props }:
    React.DetailedHTMLProps<React.HTMLAttributes<any>, any>
    &
    {
      node: NodeTypes[keyof NodeTypes]
    }
  ) {

    const NestedChildren = (p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => node.children?.length > 0 ? (
      <div { ...p }>
        { children }
      </div>
    ) : null

    const blockColor = node.props.color as ApiColor

    const c = (...c: string[]) => cn(
      ...c,
      convertColorToClassname(blockColor),
      className
    )


    switch (node.type) {

      // ----------------------  --------------------------

      case 'heading_1': return node.props.is_toggleable === true ? (
        <Toggle className="toggle-heading1" headerSlot={
          <h2 className={ c("my-0") } { ...props } id={ slugid }>
            <RichText />
          </h2 >
        }>
          <NestedChildren className="pl-4" />
        </Toggle>
      ) : (
        <h2 className={ c("") } { ...props } id={ slugid }>
          <RichText />
        </h2 >
      )



      case 'heading_2': return node.props.is_toggleable === true ? (
        <Toggle className="toggle-heading2" headerSlot={
          <h3 className={ c("my-0") } { ...props } id={ slugid }>
            <RichText />
          </h3 >
        }>
          <NestedChildren className="pl-4" />
        </Toggle>
      ) : (
        <h3 className={ c("") } { ...props } id={ slugid }>
          <RichText />
        </h3 >
      )

      case 'heading_3': return node.props.is_toggleable === true ? (
        <Toggle className="toggle-heading3" headerSlot={
          <h4 className={ c("my-0") } { ...props } id={ slugid }>
            <RichText />
          </h4 >
        }>
          <NestedChildren className="pl-4" />
        </Toggle>
      ) : (
        <h4 className={ c("") } { ...props } id={ slugid }>
          <RichText />
        </h4 >
      )

      case 'paragraph': return (
        <div className={ c("m-0 my-2") } { ...props }>
          <p>
            <RichText />
          </p>
          <NestedChildren className="pl-4" />
        </div>
      )

      case 'to_do': return (
        <ul className={ c("") } { ...props }>
          { children }
        </ul>
      )

      // ----------------------  --------------------------

      case 'bulleted_list_item': return (
        <ul className={ c("") } { ...props }>
          { children }
        </ul>
      )

      case 'numbered_list_item': return (
        <ol className={ c("") } { ...props }>
          { children }
        </ol>
      )

      case 'list_item': return (
        'checked' in node.props ? (
          <li className={ c("list-none relative", node.props.checked ? 'checked' : '') }>
            <CheckboxSVG
              checked={ node.props.checked }
              className="absolute -left-8 w-8 h-6 my-auto mb-1" />
            <RichText />
            <NestedChildren />
          </li>
        ) : (
          <li className={ c("") }>
            <RichText />
            <NestedChildren />
          </li>
        )
      )

      case 'toggle': return (
        <Toggle className={ c("") } { ...props }
          headerSlot={ <RichText /> }
        >
          <NestedChildren className="pl-4" />
        </Toggle>
      )

      case 'quote': return (
        <blockquote className={ c("") } { ...props }>
          <RichText />
          <NestedChildren />
        </blockquote>
      )

      case 'callout': return (
        <div className={ c(
          "flex gap-3 p-4 bg-zinc-900 rounded-md border-zinc-800 my-2"
        ) } { ...props } >
          <NotionIcon icon={ node.props.icon } />
          <div>
            <RichText />
            <NestedChildren />
          </div>
        </div>
      )

      case 'divider': return (
        <hr className={ c("") } { ...props } />
      )

      // ----------------------  --------------------------

      case 'code': return (
        <>
          <CodeRSC
            language={ node.props.language }
            title={ flattenedCaption }
            code={ flattenedRichText! }
          />
        </>
      )

      case 'equation': return (
        <KaTeXRSC
          className={ c("py-2 hover:bg-zinc-900") }
          math={ node.props.expression }
          block
          { ...props }
        />
      )

      // ----------------------  --------------------------

      case 'column_list': return (
        <NestedChildren className="grid grid-flow-col auto-cols-fr gap-x-4" />
      )

      case 'column': return (
        <NestedChildren className="w-full my-2" />
      )

      case 'table':
        const { has_row_header, has_column_header } = node.props
        const rows = node.children as NodeTypes['table_row'][]
        const [headRow, ...rest] = rows
        return (
          <table className={ c('') } { ...props }>
            {
              has_column_header === true ? (
                <thead>
                  <tr>
                    {
                      headRow.props.cells.map((c, i) =>
                        <th scope="row" key={ i }
                          className={ clsx() }>
                          <NotionRichText rich_text={ c } />
                        </th>
                      ) }
                  </tr>
                </thead>
              ) : null
            }
            <tbody>
              {
                (has_column_header ? rest : rows).map((c, i) =>
                  <tr key={ i }>
                    {
                      c.props.cells.map((c, i) =>
                        has_row_header && i === 0 ?
                          <th scope="col" key={ i }
                            className={ clsx() }>
                            <NotionRichText rich_text={ c } />
                          </th>
                          :
                          <td key={ i }
                            className={ clsx() }>
                            <NotionRichText rich_text={ c } />
                          </td>

                      ) }
                  </tr>
                )
              }
            </tbody>
          </table>
        )

      case 'table_row':
        return <></>

      // ----------------------  --------------------------

      case 'bookmark':
        const metadata = await getMetaInfo(node.props.url)
        return (
          <div className="my-2">
            <a
              target="_blank"
              href={ node.props.url }
              className={ c(
                "w-full flex flex-row rounded-md border border-zinc-800 no-underline"
                , "hover:bg-zinc-900/70") } { ...props } >
              <div className="p-3 w-full flex flex-col">

                {/* TITLE */ }
                <div className="text-zinc-200 truncate w-full">
                  { metadata.title }
                </div>

                {/* DESCRIPTION */ }
                {
                  metadata.description ? (
                    <div className="text-sm text-zinc-400 mt-1 mb-2 h-10 w-full line-clamp-2">
                      { metadata.description }
                    </div>
                  ) : null
                }

                {/* FOOTER */ }
                <div className="text-sm text-zinc-500 flex flex-row gap-2">

                  {/* FAVICON */ }
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

                  {/* LINK */ }
                  <div>
                    { metadata.url ? metadata.url.host : node.props.url }
                  </div>

                </div>

              </div>
            </a>
            <Caption />
          </div>
        )

      // ----------------------  --------------------------


      case 'video': {
        const external =
          'external' in node.props ? node.props.external : undefined
        const file =
          'file' in node.props ? node.props.file : undefined
        return (
          <div className={ c("my-2") } { ...props }>
            {
              external ?
                <iframe
                  className="rounded-md mx-auto"
                  // width="560"
                  // height="315"
                  src={ external.url.replace('watch?v=', 'embed/') }
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen>
                </iframe>
                : file ?
                  <video
                    controls
                    src={ file.url }
                    className="rounded-md mx-auto"
                  >
                  </video>
                  : null
            }
          </div>
        )
      }

      case 'image': {
        const url =
          'external' in node.props ? node.props.external.url :
            'file' in node.props ? node.props.file.url : ''

        return (
          <div className={ c("my-2 relative w-full p-2") } { ...props }>
            <NotionImage
              alt="A Picture"
              nprop={ node.props as any }
              className="h-auto w-auto mx-auto rounded-md"
            />
            <Caption center />
          </div>
        )
      }

      case 'pdf': {
        const url =
          'external' in node.props ? node.props.external.url :
            'file' in node.props ? node.props.file.url : ''
        return (
          <div className={ c("my-4 p-2") } { ...props }>
            <embed
              className="max-h-[60vh] aspect-[6/7] w-full rounded-md"
              src={ url }
            />
            <Caption />
          </div>
        )
      }

      case 'audio': {
        const url =
          'external' in node.props ? node.props.external.url :
            'file' in node.props ? node.props.file.url : ''

        return (
          <div className={ c("my-4 p-2") } { ...props }>
            {
              url ?
                <audio src={ url } controls className="w-full" />
                : null
            }
            <Caption />
          </div>
        )
      }

      case 'file': {
        const url =
          'external' in node.props ? node.props.external.url :
            'file' in node.props ? node.props.file.url : ''
        const filename = url
          ? await getFileName(url)
          : undefined
        const source =
          url?.includes('notion-static.com')
            ? 'notion-static.com'
            : filename?.url?.hostname
        return (
          <div className={ c("my-4 no-underline ") } { ...props }>
            <a
              href={ url }
              target="_blank"
              download={ filename }
              className="p-4 no-underline bg-zinc-900/50 rounded-md hover:bg-zinc-900 w-full flex flex-col cursor-pointer"
            >
              <FileDownloadIcon className="inline text-2xl mb-1" />
              <div className="">
                <span className="text-zinc-200">
                  { filename ? filename.title : "Unknown File Source" }
                </span>
                <span className="text-sm mx-2 text-zinc-500">
                  ({ source })
                </span>
              </div>
              <Caption className="mt-0" />
            </a>
          </div>
        )
      }

      case 'embed': {
        const url = node.props.url as string

        const spotify = url?.includes('open.spotify.com')
          ? url.replaceAll('/track/', '/embed/track/')
          : undefined

        const soundcloud = url?.includes('soundcloud.com')
          ? url
          : undefined

        return (
          <div className={ c("my-4 p-2 bg-black") } { ...props } >
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

              ) : soundcloud ? (
                <>
                  <iframe
                    width="100%"
                    height="166"
                    allow="autoplay"
                    src={ "https://w.soundcloud.com/player/?url=" + encodeURIComponent(soundcloud) }>
                  </iframe>
                </>

              ) : (
                <iframe
                  width="100%"
                  src={ url }
                >
                </iframe>
              )
            }
            <Caption center />
          </div>
        )
      }
      default:
        return <></>
    }
  }


}


type types = keyof NotionASTComponentMap
// const NotionASTDefaultComponentMap: NotionASTComponentMap = NotionASTJSXMap

// async function DefaultComponent({ children, className, node, ...props }:
//   React.DetailedHTMLProps<React.HTMLAttributes<any>, any>
//   &
//   {
//     node: NodeTypes[keyof NodeTypes]
//   }
// ) {

//   const RichText = () => node.content ?
//     <NotionRichText rich_text={ node.content } /> : null
//   const flattenedRichText = flattenRichText(node.content)

//   const Caption = ({ ...rest }: Omit<React.ComponentProps<typeof NotionFigureCaption>, 'caption'>) => node.props.caption ?
//     <NotionFigureCaption caption={ node.props.caption } { ...rest } /> : null
//   const flattenedCaption = flattenRichText(node.props.caption)
//   const NestedChildren = (p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => node.children ? (
//     <div { ...p }>
//       { children }
//     </div>
//   ) : null

//   const cn = (...c: string[]) => clsx(...c, className)



//   switch (node.type) {

//     // ----------------------  --------------------------

//     case 'heading_1': return (
//       <h2 className={ cn("text-3xl") } { ...props }>
//         <RichText />
//       </h2>
//     )

//     case 'heading_2': return (
//       <h3 className={ cn("text-xl") } { ...props }>
//         <RichText />
//       </h3>
//     )

//     case 'heading_3': return (
//       <h4 className={ cn("text-lg") } { ...props }>
//         <RichText />
//       </h4>
//     )

//     case 'paragraph': return (
//       <>
//         <p className={ clsx("m-0 my-2", className) } { ...props }>
//           <RichText />
//         </p>
//         <NestedChildren className="pl-4" />
//       </>
//     )

//     case 'to_do': return (
//       <ul className={ cn("") } { ...props }>
//         { children }
//       </ul>
//     )

//     // ----------------------  --------------------------

//     case 'bulleted_list_item': return (
//       <ul className={ cn("") } { ...props }>
//         { children }
//       </ul>
//     )

//     case 'numbered_list_item': return (
//       <ol className={ cn("") } { ...props }>
//         { children }
//       </ol>
//     )

//     case 'list_item': return (
//       'checked' in node.props ? (
//         <li className={ cn("list-none ml-0") }>
//           <CheckboxSVG
//             checked={ node.props.checked }
//             className="inline w-8 h-6 my-auto mb-1" />
//           <RichText />
//           <NestedChildren />
//         </li>
//       ) : (
//         <li className={ cn("") }>
//           <RichText />
//           <NestedChildren />
//         </li>
//       )
//     )

//     case 'toggle': return (
//       <Toggle className={ cn("") } { ...props }
//         headerSlot={ <RichText /> }
//       >
//         <NestedChildren className="pl-4" />
//       </Toggle>
//     )

//     case 'quote': return (
//       <blockquote className={ cn("") } { ...props }>
//         <RichText />
//         <NestedChildren className="pl-4" />
//       </blockquote>
//     )

//     case 'callout': return (
//       <div className={
//         cn(
//           "flex gap-4 p-4 bg-zinc-900 rounded-md border-zinc-800 my-2"
//         )
//       } { ...props } >
//         <NotionIcon
//           icon={ node.props.icon }
//           className="text-lg"
//         />
//         <div>
//           <RichText />
//           <NestedChildren />
//         </div>
//       </div>
//     )

//     case 'divider': return (
//       <hr className={ cn("") } { ...props } />
//     )

//     // ----------------------  --------------------------

//     case 'code': return (
//       <>
//         <CodeRSC
//           language={ node.props.language }
//           title={ flattenedCaption }
//           code={ flattenedRichText! }
//         />
//       </>
//     )

//     case 'equation': return (
//       <KaTeXRSC
//         className={ cn("py-2 hover:bg-zinc-900") }
//         math={ node.props.expression }
//         block
//         { ...props }
//       />
//     )

//     // ----------------------  --------------------------

//     case 'column_list': return (
//       <NestedChildren className="grid grid-flow-col auto-cols-fr gap-x-4" />
//     )

//     case 'column': return (
//       <NestedChildren className="w-full my-2" />
//     )

//     case 'table':
//       const { has_row_header, has_column_header } = node.props
//       const rows = node.children as NodeTypes['table_row'][]
//       const [headRow, ...rest] = rows
//       const cellCn = 'border border-zinc-800 p-2 px-2.5'
//       return (
//         <table className={ cn("my-3 bg-zinc-900/70") } { ...props }>
//           {
//             has_row_header === true ? (
//               <thead>
//                 <tr>
//                   {
//                     headRow.props.cells.map((c, i) =>
//                       <th scope="row" key={ i }
//                         className={ clsx(cellCn, "bg-black") }>
//                         <RichText />
//                       </th>
//                     ) }
//                 </tr>
//               </thead>
//             ) : null
//           }
//           <tbody>
//             {
//               (has_row_header ? rest : rows).map((c, i) =>
//                 <tr key={ i }>
//                   {
//                     c.props.cells.map((c, i) =>
//                       has_column_header && i === 0 ?
//                         <th scope="col" key={ i }
//                           className={ clsx(cellCn, "bg-black") }>
//                           <RichText />
//                         </th>
//                         :
//                         <td key={ i }
//                           className={ clsx(cellCn) }>
//                           <RichText />
//                         </td>

//                     ) }
//                 </tr>
//               )
//             }
//           </tbody>
//         </table>
//       )

//     case 'table_row':
//       return <></>

//     // ----------------------  --------------------------

//     case 'bookmark':
//       const metadata = await getMetaInfo(node.props.url)
//       return (
//         <div className="my-2">
//           <a
//             target="_blank"
//             href={ node.props.url }
//             className={ cn(
//               "w-full flex flex-row rounded-md border border-zinc-800 no-underline"
//               , "hover:bg-zinc-900/70") } { ...props } >
//             <div className="p-3 w-full flex flex-col">

//               {/* TITLE */ }
//               <div className="text-zinc-200 truncate w-full">
//                 { metadata.title }
//               </div>

//               {/* DESCRIPTION */ }
//               {
//                 metadata.description ? (
//                   <div className="text-sm text-zinc-400 mt-1 mb-2 h-10 w-full line-clamp-2">
//                     { metadata.description }
//                   </div>
//                 ) : null
//               }

//               {/* FOOTER */ }
//               <div className="text-sm text-zinc-500 flex flex-row gap-2">

//                 {/* FAVICON */ }
//                 {
//                   metadata.faviconpath ? (
//                     <div className="flex items-center">
//                       <Image
//                         unoptimized
//                         width="16"
//                         height="16"
//                         src={ metadata.faviconpath }
//                         alt="Link Icon URL"
//                         className="w-4 h-4"
//                       />
//                     </div>
//                   ) : null
//                 }

//                 {/* LINK */ }
//                 <div>
//                   { metadata.url ? metadata.url.host : node.props.url }
//                 </div>

//               </div>

//             </div>
//           </a>
//           <Caption />
//         </div>
//       )

//     // ----------------------  --------------------------


//     case 'video': {
//       const external =
//         'external' in node.props ? node.props.external : undefined
//       const file =
//         'file' in node.props ? node.props.file : undefined
//       return (
//         <div className={ cn("my-2") } { ...props }>
//           {
//             external ?
//               <iframe
//                 className="rounded-md mx-auto"
//                 width="560"
//                 height="315"
//                 src={ external.url.replace('watch?v=', 'embed/') }
//                 title="YouTube video player"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                 allowFullScreen>
//               </iframe>
//               : file ?
//                 <video
//                   controls
//                   src={ file.url }
//                   className="rounded-md mx-auto"
//                 >
//                 </video>
//                 : null
//           }
//         </div>
//       )
//     }

//     case 'image': {
//       const url =
//         'external' in node.props ? node.props.external.url :
//           'file' in node.props ? node.props.file.url : ''

//       return (
//         <div className={ cn("my-2 relative w-full p-2") } { ...props }>
//           <NotionImage
//             alt="A Picture"
//             nprop={ node.props as any }
//             className="h-auto w-auto mx-auto rounded-md"
//           />
//           <Caption center />
//         </div>
//       )
//     }

//     case 'pdf': {
//       const url =
//         'external' in node.props ? node.props.external.url :
//           'file' in node.props ? node.props.file.url : ''
//       return (
//         <div className={ cn("my-4 p-2") } { ...props }>
//           <embed
//             className="max-h-[60vh] aspect-[6/7] w-full rounded-md"
//             src={ url }
//           />
//           <Caption />
//         </div>
//       )
//     }

//     case 'audio': {
//       const url =
//         'external' in node.props ? node.props.external.url :
//           'file' in node.props ? node.props.file.url : ''

//       return (
//         <div className={ cn("my-4 p-2") } { ...props }>
//           {
//             url ?
//               <audio src={ url } controls className="w-full" />
//               : null
//           }
//           <Caption />
//         </div>
//       )
//     }

//     case 'file': {
//       const url =
//         'external' in node.props ? node.props.external.url :
//           'file' in node.props ? node.props.file.url : ''
//       const filename = url
//         ? await getFileName(url)
//         : undefined
//       const source =
//         url?.includes('notion-static.com')
//           ? 'notion-static.com'
//           : filename?.url?.hostname
//       return (
//         <div className={ cn("my-4 no-underline ") } { ...props }>
//           <a
//             href={ url }
//             target="_blank"
//             download={ filename }
//             className="p-4 no-underline bg-zinc-900/50 rounded-md hover:bg-zinc-900 w-full flex flex-col cursor-pointer"
//           >
//             <FileDownloadIcon className="inline text-2xl mb-1" />
//             <div className="flex flex-row items-end">
//               <span className="text-zinc-200">
//                 { filename ? filename.title : "Unknown File Source" }
//               </span>
//               <span className="text-sm mx-2 text-zinc-500">
//                 ({ source })
//               </span>
//             </div>
//             <Caption className="mt-0" />
//           </a>
//         </div>
//       )
//     }

//     case 'embed': {
//       const url = node.props.url as string

//       const spotify = url?.includes('open.spotify.com')
//         ? url.replaceAll('/track/', '/embed/track/')
//         : undefined

//       const soundcloud = url?.includes('soundcloud.com')
//         ? url
//         : undefined

//       return (
//         <div className={ cn("my-4 p-2 bg-black") } { ...props } >
//           {
//             spotify ? (
//               <iframe
//                 className="bg-black rounded-xl"
//                 src={ spotify }
//                 width="100%"
//                 height="152"
//                 allowFullScreen
//                 allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
//                 loading="lazy"
//               >
//               </iframe>

//             ) : soundcloud ? (
//               <>
//                 <iframe
//                   width="100%"
//                   height="166"
//                   allow="autoplay"
//                   src={ "https://w.soundcloud.com/player/?url=" + encodeURIComponent(soundcloud) }>
//                 </iframe>
//               </>

//             ) : (
//               <iframe
//                 width="100%"
//                 src={ url }
//               >
//               </iframe>
//             )
//           }
//           <Caption center />
//         </div>
//       )
//     }
//     default:
//       return <></>
//   }
// }