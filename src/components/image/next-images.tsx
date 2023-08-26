import { inRemotePattern } from "../next/remotePattern"
import Image from "next/image"
import { getImage } from "./placeholder"

type NextImageProp = React.ComponentProps<typeof Image>

export async function NextImage({
  src,
  alt,
  unoptimized,
  width,
  height,
  ...props
}: NextImageProp) {

  let optimize: boolean = true
  let _width: number | `${number}` | undefined = undefined
  let _height: number | `${number}` | undefined = undefined
  let _blurDataURL: string | undefined = undefined
  if (typeof src === 'string') {
    optimize = inRemotePattern(src)
    if (!optimize)
      console.warn(`WARN: Image not found in remotePattern, not optimised: ${src}`)

    const data = await getImage(src)

    if (!width || !height) {
      _width = data.img.width
      _height = data.img.height
    } else {
      _width = width,
      _height = height
    }
    
    _blurDataURL = data.base64

  }


  return (
    <Image
      unoptimized={ unoptimized ?? optimize }
      src={ src }
      alt={ alt }
      width={ _width }
      height={ _height }
      placeholder="blur"
      blurDataURL={ _blurDataURL }
      { ...props }
    />
  )

}