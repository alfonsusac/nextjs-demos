import { cn } from "@/components/typography"
import { NotionComponentProp } from "../notion-ast-renderer-2"
import { NotionImage } from "../images"
import { CaptionNode } from "./common"
import { getFileName } from "@/components/metadata/util"
import { FileDownloadIcon } from "@/components/svg"

export function VideoBlock({
  className,
  node,
}: NotionComponentProp<'video'>) {

  const external =
    'external' in node.props ? node.props.external : undefined
  const file =
    'file' in node.props ? node.props.file : undefined

  return (
    <div className={ cn(className, "my-2") }>
      {
        external ?
          <iframe
            className="rounded-md mx-auto"
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



export function ImageBlock({
  className,
  node,
}: NotionComponentProp<'image'>) {

  return (
    <div className={ cn(className, "my-2 relative w-full p-2") }>
      <NotionImage
        alt="A Picture"
        nprop={ node.props as any }
        className="h-auto w-auto mx-auto rounded-md"
        id={ node.id }
      />
      <CaptionNode center node={ node } />
    </div>
  )

}



export function PDFBlock({
  className,
  node,
}: NotionComponentProp<'pdf'>) {

  const url =
    'external' in node.props ? node.props.external.url :
      'file' in node.props ? node.props.file.url : ''

  return (
    <div className={ cn(className, "my-4 p-2") }>
      <embed
        className="max-h-[60vh] aspect-[6/7] w-full rounded-md"
        src={ url }
      />
      <CaptionNode node={ node } />
    </div>
  )

}



export function AudioBlock({
  className,
  node,
}: NotionComponentProp<'audio'>) {

  const url =
    'external' in node.props ? node.props.external.url :
      'file' in node.props ? node.props.file.url : ''

  return (
    <div className={ cn(className, "my-4 p-2") }>
      {
        url ?
          <audio src={ url } controls className="w-full" />
          : null
      }
      <CaptionNode node={ node } />
    </div>
  )

}



export async function FileBlock({
  className,
  node,
}: NotionComponentProp<'file'>) {

  const url =
    'external' in node.props ? node.props.external.url :
      'file' in node.props ? node.props.file.url : ''

  const filename = url
    ? await getFileName(url)
    : undefined

  const source =
    url?.includes('notion-static.com')
      ? 'notion-static.com'
      : filename?.url ? (new URL(filename.url)).hostname : undefined

  return (
    <div className={ cn(className, "my-4 no-underline ") }>
      <a
        href={ url }
        target="_blank"
        download={ filename }
        className="p-4 no-underline bg-slate-900/50 rounded-md hover:bg-slate-900 w-full flex flex-col cursor-pointer"
      >
        <FileDownloadIcon className="inline text-2xl mb-1" />
        <div className="">
          <span className="text-slate-200">
            { filename ? filename.title : "Unknown File Source" }
          </span>
          <span className="text-sm mx-2 text-slate-500">
            ({ source })
          </span>
        </div>
        <CaptionNode node={ node } />
      </a>
    </div>
  )

}



export async function EmbedBlock({
  className,
  node,
}: NotionComponentProp<'embed'>) {

  const url = node.props.url as string

  const spotify = url?.includes('open.spotify.com')
    ? url.replaceAll('/track/', '/embed/track/')
    : undefined

  const soundcloud = url?.includes('soundcloud.com')
    ? url
    : undefined

  return (
    <div className={ cn(className, "my-4 p-2 bg-black") }>
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
      <CaptionNode node={ node } />
    </div>
  )
}