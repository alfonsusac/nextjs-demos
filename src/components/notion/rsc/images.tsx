import { cn } from "@/components/typography"
import { CalloutBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import Image from "next/image"
import probe from "probe-image-size"
import remotePatterns from "../../../../remotePattern.mjs"


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
  ...props
}: {
  nprop: ImageObject
  alt: string
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

  const url =
    'external' in nprop ? nprop.external.url :
      'file' in nprop ? nprop.file.url : ''

  const optimize = inRemotePattern(url)
  // console.log(optimize + ': ')

  const res = await probe(url)


  return (
    <div className={ cn('relative', className) }>
      <Image
        unoptimized={ !optimize }
        // fill
        width={ res.width }
        height={ res.height }
        src={ url }
        alt={ alt }
        { ...props }
      />
    </div>
  )
}


function inRemotePattern(urlstr: string): boolean {

  let url: URL
  try {
    url = new URL(urlstr)
  } catch (error) {
    // console.log("Invalid URL: " + urlstr)
    return false
  }

  const patterns = remotePatterns as any


  if (!patterns) return true

  for (const pattern of patterns) {
    const host = pattern.hostname
    const path = pattern.pathname
    const hostNoStars = host.replaceAll('*', '')

    // Hostname doesn't match
    if (url.hostname.endsWith(hostNoStars) === false) {
      // console.log("  hostname doesn't match")
      // console.log("  " + url.hostname)
      // console.log("  " + hostNoStars)
      continue
    }

    // Wildcard doesn't match
    if (host.startsWith('**') === false) {
      if (host.startsWith('*') === true &&
        url.host.replace(hostNoStars, '').includes('.')
      ) {
        // console.log("  hostname wildcard doesn't match")
        continue
      }
    }

    if (path) {
      const pathNoStars = path.replaceAll('*', '')

      // Pathname doesn't match
      if (url.pathname.startsWith(pathNoStars) === false) {
        // console.log("  pathname doesn't match")
        // console.log("  " + url.pathname)
        // console.log("  " + pathNoStars)
        continue
      }

      // Wildcard doesn't match
      if (path.endsWith('**') === false) {
        if (path.endsWith('*') === true &&
          url.host.replace(hostNoStars, '').includes('.')
        ) {
          // console.log("  pathname wildcard doesn't match")
          continue
        }
      }
    }

    if (pattern.port) {
      if (url.port !== pattern.port) {
        // console.log("  port doesn't match")
        continue
      }
    }

    if (pattern.protocol) {
      if (url.protocol.startsWith(pattern.protocol) === false) {
        // console.log("  pattern doesn't match")
        continue
      }

    }

    // console.log("MATCH!")
    return true

  }
  console.log("URL doesn't match any pattern: " + url)
  return false
}