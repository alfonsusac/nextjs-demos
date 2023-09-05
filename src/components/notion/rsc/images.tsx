import { cn } from "@/components/typography"
import { CalloutBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
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

export function NotionImage({
  nprop, alt, className, id, ...props
}: {
  nprop: ImageObject
  alt: string
  id?: string
} & Pick<
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
}


function processNotionStaticImageURL(url: string, id?: string): string {
  if (
    !url.includes('secure.notion-static.com')
    && !url.includes('prod-files-secure')
  ) return url

  if (!id) throw new Error("Notion Static Images requires ID")
   
  // Convert URL from block retrieve
  //  into Notion's Static Website URL
  const newurl = `https://alfonsusardani.notion.site/image/${encodeURIComponent(url.split('?')[0])}?table=block&id=${id}`
  return newurl
}





