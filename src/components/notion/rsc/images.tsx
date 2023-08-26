import { cn } from "@/components/typography"
import { CalloutBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import Image from "next/image"
import { ImageModal } from "../client"
import Link from "next/link"
import { getImage } from "@/components/image/placeholder"
import { NextImage } from "@/components/image/next-images"

export function NotionIcon({
  icon,
  className
}: {
  icon: CalloutBlockObjectResponse['callout']['icon']
  className?: string
}) {
  if (!icon) return <></>

  if (icon.type === 'emoji')
    return <div className={ cn(className) }>
      <span
        className={ cn('inline w-6 h-6 rounded-sm') }
        style={ {
          marginBottom: '0.1em',
          verticalAlign: '-0.1em',
          minWidth: '1em',
          lineHeight: '0.8',
        } }
      >
        { icon.emoji }
      </span>
    </div>

  if (icon.type === 'external')
    // eslint-disable-next-line @next/next/no-img-element
    return <img
      alt='Callout Icon'
      className={ cn("inline w-6 h-6 rounded-sm", className) }
      src={ icon.external.url }
      style={ {
        marginTop: '0.1em',
        verticalAlign: '-0.1em',
        minWidth: '1em'
      } }
    />

  if (icon.type === 'file')
    // eslint-disable-next-line @next/next/no-img-element
    return <img
      alt='Callout Icon'
      className={ cn("inline w-6 h-6 rounded-sm", className) }
      src={ icon.file.url }
      style={ {
        marginTop: '0.1em',
        verticalAlign: '-0.1em',
        minWidth: '1em'
      } }
    />
}

type ImageObject = {
  type: "file"
  file: {
    url: string
    expiry_time: string
  }
} | {
  type: "external"
  external: {
    url: string
  }
}

export async function NotionImage({
  nprop,
  alt,
  className,
  enlargable,
  id,
  ...props
}: {
  nprop: ImageObject
  alt: string
  enlargable?: boolean
  id?: string

}
  & Pick<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<
        HTMLImageElement
      >, HTMLImageElement
    >, 'src' | 'alt' | 'className'
  >
) {
  if (!nprop) return


  let url =
    'external' in nprop ? nprop.external.url :
      'file' in nprop ? nprop.file.url : ''

  url = processNotionStaticImageURL(url, id)

  const ImageContent = (
    <div className={ cn(`
      relative
      transition-all
    `, className) }>

      <NextImage
        className='object-cover w-full'
        src={ url }
        alt={ alt }
        { ...props }
      />

    </div>
  )

  return ImageContent

  if (!enlargable) return ImageContent
  else
    
    
    
    return (
      <ImageModal
        content={
          <div className="w-full h-full flex flex-col justify-center items-center">

              <NextImage
                unoptimized
                className="w-auto h-auto max-w-full max-h-full"
                src={ url }
                alt={ alt }
                { ...props }
              />
              <Link
                className="block my-4 hover:brightness-150"
                href={ url }
                target="_blank"
                prefetch={ false }
              >
                Open original image
              </Link>


            </div>
        }
      >
        { ImageContent }
      </ImageModal>
    )
}


function processNotionStaticImageURL(url: string, id?: string): string {
  if (!url.includes('secure.notion-static.com')) return url
  if (!id) throw new Error("Notion Static Images requires ID")
  const newurl = `https://alfonsusardani.notion.site/image/${encodeURIComponent(url.split('?')[0])}?table=block&id=${id}`
  return newurl
}





