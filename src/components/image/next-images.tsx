import { inRemotePattern } from "../next/remotePattern"
import Image from "next/image"
import { getCachedImage, getImage } from "./placeholder"
import { cn } from "../typography"

type NextImageProp = React.ComponentProps<typeof Image>

export async function NextImage({
  src,
  alt,
  unoptimized,
  width,
  height,
  className,
  loader,
  ...props
}: NextImageProp) {

  let optimize: boolean = true
  let _width: number | `${number}` | undefined = undefined
  let _height: number | `${number}` | undefined = undefined
  let _blurDataURL: string | undefined = undefined

  if (typeof src === 'string') {
    optimize = inRemotePattern(src)
    if (!optimize)
      console.info(`WARN: Image not found in remotePattern, not optimised: ${src}`)
    // const { base64 } = await getCachedImage(src)
    // _blurDataURL = base64 ?? undefined
  }

  return (
    <Image
      unoptimized={ unoptimized ?? !optimize }
      className={ cn(className, (unoptimized ?? !optimize) ? 'not-optimize' : 'optimized') }
      src={ src }
      alt={ alt }
      width={ 1920 }
      height={ 1920 }
      sizes='100vw'
      // placeholder="blur"
      // blurDataURL={ _blurDataURL }
      style={ {
        aspectRatio: `${_width} / ${_height}`
      } }
      { ...props }
    />
  )
}