import { inRemotePattern } from "../next/remotePattern"
import Image from "next/image"
import { getImage } from "./placeholder"
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
    if (!optimize) console.warn(`WARN: Image not found in remotePattern, not optimised: ${src}`)

    
    const data = await getImage(src)

    if (data) {
      if (!width || !height) {
        if(data.width)
          _width = data.width
        if(data.height)
          _height = data.height
      } else {
        _width = width,
        _height = height
      }
      
      if(data.base64)
        _blurDataURL = data.base64
    }

  }




  return (
    <Image
      unoptimized={ unoptimized ?? !optimize }
      className={ cn(className, (unoptimized ?? !optimize) ? 'not-optimize' : 'optimized') }
      src={ src }
      alt={ alt }
      width={ _width }
      height={ _height }
      sizes='100vw'
      // fill
      // width={ 30 }
      // height={ 30 }
      placeholder="blur"
      blurDataURL={ _blurDataURL }
      style={ {
        aspectRatio: `${_width} / ${_height}`
      }}
      { ...props }
    />
  )

}