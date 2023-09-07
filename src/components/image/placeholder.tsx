import fetch2 from 'node-fetch'
import { getPlaiceholder } from "plaiceholder"
import sizeof from 'object-sizeof'
import { unstable_cache } from 'next/cache'
import { Audit } from '../timer'
import { convertBMPtoPNG } from './bmp-processor'
import probe, {} from "probe-image-size"


export async function getImage(src: string) {

  const audit = new Audit('Image Component', false)

  const cache = await unstable_cache(
    async () => {
      try {
        // Get file buffer
        const res = await fetch2(src)
        let buffer = Buffer.from(await res.arrayBuffer())
        // Convert unsupported format
        if (get_url_extension(src) === 'bmp')
          buffer = await convertBMPtoPNG(buffer)
        try {
          // Generate placeholder data
          const plaiceholder = await getPlaiceholder(buffer, { size: 10, removeAlpha: true })
          const data = {
            base64: plaiceholder.base64,
            src,
            height: plaiceholder.metadata.height,
            width: plaiceholder.metadata.width,
          }
          // Finish
          console.log("- Size of GetImage Cached: " + sizeof(res) + " Bytes")
          audit.mark('- Retrieving Image Cache')
          return data

        } catch (error) {
          // Fetch via probing
          console.error("Error at generating placeholder.")
          console.log(error)
          const meta = await probe(src)
          return {
            base64: null,
            src,
            height: meta.height,
            width: meta.width
          }
        }
      } catch (error) {
        // Error
        console.error("Error at fetching src.")
        console.log(error)
        return {
          base64: null,
          src,
          height: null,
          width: null
        }
      }
    },
    ['image', src],
    {
      tags: ['image', src],
      revalidate: 2
    }
  )();

  audit.total()
  return cache

}



function get_url_extension(url: string) {
  return url.split(/[#?]/)[0].split('.').pop()?.trim()
}