import fetch2 from 'node-fetch'
import { getPlaiceholder } from "plaiceholder"
import sizeof from 'object-sizeof'
import { unstable_cache } from 'next/cache'


export async function getImage(src: string) {

  return (
    unstable_cache(
      async () => {
        const buffer = await fetch2(src).then(async (res) => Buffer.from(await res.arrayBuffer()))

        const {
          metadata: { height, width },
          ...plaiceholder
        } = await getPlaiceholder(buffer, {
          size: 10
        },)


        const res = {
          base64: plaiceholder.base64,
          img: { src, height, width },
        }

        console.log("Size of GetImage Cached: " + sizeof(res) + " Bytes")

        return res
      },
      ['image', src],
      {
        tags: ['image', src]
      }
    )()
  )

}

